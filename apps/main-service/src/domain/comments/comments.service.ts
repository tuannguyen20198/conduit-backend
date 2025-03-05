import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from '@nnpp/database';

@Injectable()
export class CommentsService {
  constructor(private databaseService:DatabaseService){}
  async create(slug: string, body: string, userId: number) {
    if (!body.trim()) {
      throw new BadRequestException('Comment body cannot be empty');
    }
  
    const article = await this.databaseService.article.findUnique({ where: { slug } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
  
    const newComment = await this.databaseService.comment.create({
      data: {
        body,
        article: { connect: { slug } },
        author: { connect: { id: userId } },
      },
    });
  
    return { comment: newComment };
  }
  async findAll() {
    const comments = await this.databaseService.comment.findMany({
      include: { author: true, article: true }, // Lấy thông tin user & bài viết
    });
    return { comments };
  }
  async deleteComment(slug: string, commentId: number, userId: number) {
    // Tìm bài viết theo slug
    const article = await this.databaseService.article.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Tìm comment theo id và bài viết
    const comment = await this.databaseService.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.articleId !== article.id) {
      throw new NotFoundException('Comment not found');
    }

    // Kiểm tra quyền sở hữu (chỉ người tạo comment mới được xóa)
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    // Xóa comment
    await this.databaseService.comment.delete({
      where: { id: commentId },
    });

    return { comment};
  }
  async favoriteArticle(slug: string, userId: number) {
    // Kiểm tra user có tồn tại không
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Tìm bài viết theo slug
    const article = await this.databaseService.article.findUnique({
      where: { slug },
      include: { favorites: true },
    });
  
    if (!article) {
      throw new NotFoundException('Article not found');
    }
  
    // Kiểm tra xem user đã favorite bài viết chưa
    const isFavorited = article.favorites.some((fav) => fav.user_id === userId);
  
    if (!isFavorited) {
      // Thêm vào bảng Favorite
      await this.databaseService.favorite.create({
        data: {
          user_id: userId,
          article_id: article.id,
        },
      });
    }
  
    // Lấy lại bài viết đã cập nhật
    const updatedArticle = await this.databaseService.article.findUnique({
      where: { slug },
      include: { favorites: true },
    });
  
    return { article: updatedArticle };
  }
  async unfavoriteArticle(slug: string, userId: number) {
    // Kiểm tra user có tồn tại không
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Tìm bài viết theo slug
    const article = await this.databaseService.article.findUnique({
      where: { slug },
      include: { favorites: true },
    });
  
    if (!article) {
      throw new NotFoundException('Article not found');
    }
  
    // Kiểm tra xem user đã favorite bài viết chưa
    const favorite = await this.databaseService.favorite.findFirst({
      where: { user_id: userId, article_id: article.id },
    });
  
    if (!favorite) {
      throw new BadRequestException('Article is not favorited by this user');
    }
  
    // Xoá khỏi bảng Favorite
    await this.databaseService.favorite.delete({
      where: { id: favorite.id },
    });
  
    // Lấy lại bài viết đã cập nhật
    const updatedArticle = await this.databaseService.article.findUnique({
      where: { slug },
      include: { favorites: true },
    });
  
    return { article: updatedArticle };
  }
  
}
