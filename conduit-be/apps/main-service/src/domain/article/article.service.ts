import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '@nnpp/database';
import { CreateArticleDto } from './dto/create-article.dto';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private databaseServices: DatabaseService) {}
  async getArticles({
    tag,
    author,
    favorited,
    pagination,
  }: {
    tag?: string;
    author?: string;
    favorited?: string;
    pagination: { limit: number; offset: number };
  }) {
    const { limit, offset } = pagination;

    const where: any = {};

    if (tag) {
      where.tagList = {
        some: {
          name: {
            in: tag.split(','), // Tìm bài viết chứa ÍT NHẤT 1 tag trong danh sách
          },
        },
      };
    }
    if (author) {
      where.author = { username: author };
    }

    if (favorited) {
      where.favoritedBy = { some: { username: favorited } };
    }

    const articles = await this.databaseServices.article.findMany({
      where,
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
        tagList: {
          select: {
            name: true, // Lấy danh sách tag của bài viết
          },
        },
        favoritedBy: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return {
      articles: articles.map((article) => ({
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList?.map((tag) => tag?.name) || [],
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
          following: false, // Cần cập nhật theo trạng thái của người dùng hiện tại
        },
        favorited: false, // Cần cập nhật theo user đăng nhập
        favoritesCount: article.favoritedBy.length,
      })),
      articlesCount: await this.databaseServices.article.count({ where }),
    };
  }
  // Lấy danh sách tác giả viết về 1 tag

  async getFeedArticles(userId: number, limit: number, offset: number) {
    // Lấy thông tin người dùng và các người mà họ đang theo dõi
    const user = await this.databaseServices.user.findUnique({
      where: { id: userId },
      include: { following: true }, // Lấy danh sách người dùng mà họ đang theo dõi
    });

    if (!user) {
      throw new Error('User not found');
    }

    console.log('User following:', user.following); // Kiểm tra xem người dùng đang theo dõi ai

    // Lấy các user mà người dùng đang theo dõi
    const followingUsers = user.following;

    if (followingUsers.length === 0) {
      return { articles: [], articlesCount: 0 }; // Không có ai để theo dõi
    }

    // Log danh sách các username mà người dùng đang theo dõi
    const followingUsernames = followingUsers.map(
      (followedUser) => followedUser.username,
    );
    console.log('Following usernames:', followingUsernames);

    // Truy vấn các bài viết từ những người dùng mà người dùng đang theo dõi
    const articles = await this.databaseServices.article.findMany({
      where: {
        author: {
          username: {
            in: followingUsernames, // Lọc theo các username mà người dùng đang theo dõi
          },
        },
      },
      skip: offset, // Phân trang - bỏ qua số lượng bài viết đã lấy
      take: limit, // Lấy số lượng bài viết giới hạn
      orderBy: {
        createdAt: 'desc', // Sắp xếp theo thời gian tạo bài viết giảm dần
      },
      include: {
        author: true, // Bao gồm thông tin tác giả (nếu cần)
      },
    });

    console.log('Fetched articles:', articles); // Log các bài viết đã lấy được

    if (articles.length === 0) {
      return { articles: [], articlesCount: 0 }; // Không có bài viết thỏa mãn điều kiện
    }

    const articlesCount = articles.length; // Đếm số lượng bài viết lấy được

    return { articles, articlesCount }; // Trả về bài viết và số lượng bài viết
  }

  async getArticleBySlug(slug: string, currentUserId?: number) {
    const article = await this.databaseServices.article.findUnique({
      where: { slug },
      include: {
        author: {
          include: {
            followedBy: true, // Để check "following"
          },
        },
        favoritedBy: true, // Để check "favorited"
        tagList: true, // Để lấy danh sách tag
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList.map((tag) => tag.name), // Chuyển từ object sang array
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: article.favoritedBy.some(
          (user) => user.id === currentUserId,
        ),
        favoritesCount: article.favoritedBy.length,
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image:
            article.author.image ||
            'https://static.vecteezy.com/system/resources/previews/002/608/327/non_2x/mobile-application-avatar-web-button-menu-digital-silhouette-style-icon-free-vector.jpg',
          following: article.author.followedBy.some(
            (follower) => follower.id === currentUserId,
          ),
        },
      },
    };
  }

  async createArticle(dto: CreateArticleDto, userId: number) {
    if (!dto.title || !dto.description || !dto.body) {
      throw new HttpException(
        { message: 'Missing required fields: title, description, or body.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (Number(userId) <= 0) {
      throw new HttpException(
        { message: 'User ID không hợp lệ.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const slug = slugify(dto.title, { lower: true });

    // Kiểm tra slug có tồn tại không
    const existingArticle = await this.databaseServices.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      throw new HttpException(
        { message: 'Slug already exists. Please choose a different title.' },
        HttpStatus.CONFLICT, // 409 Conflict
      );
    }

    try {
      const article = await this.databaseServices.article.create({
        data: {
          slug,
          title: dto.title,
          description: dto.description,
          body: dto.body,
          authorId: Number(userId),
          tagList: {
            connectOrCreate:
              dto.tagList?.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })) || [],
          },
        },
        include: {
          author: {
            include: {
              followedBy: true,
            },
          },
          favoritedBy: true,
          tagList: true,
        },
      });

      return {
        article: {
          slug: article.slug,
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tagList.map((tag) => tag.name),
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          favorited: false,
          favoritesCount: article.favoritedBy.length,
          author: {
            username: article.author.username,
            bio: article.author.bio,
            image:
              article.author.image ||
              'https://static.vecteezy.com/system/resources/previews/002/608/327/non_2x/mobile-application-avatar-web-button-menu-digital-silhouette-style-icon-free-vector.jpg',
            following: false,
          },
        },
      };
    } catch (error) {
      console.error('Error creating article:', error);

      throw new HttpException(
        { message: 'Failed to create article.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateArticle(slug: string, dto: UpdateArticleDto, userId: number) {
    const article = await this.databaseServices.article.findUnique({
      where: { slug },
      include: {
        author: {
          include: { followedBy: true },
        },
        favoritedBy: true,
        tagList: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to edit this article');
    }

    let updateData: any = {};
    if (dto.title && dto.title !== article.title) {
      updateData.title = dto.title;
      updateData.slug = slugify(dto.title, { lower: true });
    }
    if (dto.description) updateData.description = dto.description;
    if (dto.body) updateData.body = dto.body;

    if (dto.tagList) {
      updateData.tagList = {
        set: [],
        connectOrCreate: dto.tagList.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      };
    }

    const updatedArticle = await this.databaseServices.article.update({
      where: { id: article.id },
      data: { ...updateData, updatedAt: new Date() },
      include: {
        author: {
          include: { followedBy: true },
        },
        favoritedBy: true,
        tagList: true,
      },
    });

    return {
      article: {
        slug: updatedArticle.slug,
        title: updatedArticle.title,
        description: updatedArticle.description,
        body: updatedArticle.body,
        tagList: updatedArticle.tagList.map((tag) => tag.name), // 🏷 Chuyển tag object -> array
        createdAt: updatedArticle.createdAt,
        updatedAt: updatedArticle.updatedAt,
        favorited: false, // Cần cập nhật theo trạng thái của user
        favoritesCount: updatedArticle.favoritedBy.length,
        author: {
          username: updatedArticle.author.username,
          bio: updatedArticle.author.bio,
          image:
            updatedArticle.author.image ||
            'https://static.vecteezy.com/system/resources/previews/002/608/327/non_2x/mobile-application-avatar-web-button-menu-digital-silhouette-style-icon-free-vector.jpg',
          following: false, // Mặc định là false khi cập nhật bài viết
        },
      },
    };
  }

  async deleteArticle(slug: string, userId: number) {
    // Tìm bài viết theo slug
    const article = await this.databaseServices.article.findUnique({
      where: { slug },
      include: { author: true }, // Lấy thông tin tác giả để kiểm tra quyền
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Kiểm tra user có phải tác giả không
    if (article.authorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this article',
      );
    }

    // Xóa bài viết
    await this.databaseServices.article.delete({ where: { slug } });

    return { message: 'Article deleted successfully' };
  }

  async addComment(slug: string, userId: number, body: string) {
    // Tìm bài viết theo slug
    const article = await this.databaseServices.article.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Tạo bình luận mới
    const comment = await this.databaseServices.comment.create({
      data: {
        body,
        authorId: userId,
        articleId: article.id,
      },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
      },
    });

    return {
      comment: {
        id: comment.id,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        body: comment.body,
        author: {
          username: comment.author.username,
          bio: comment.author.bio,
          image:
            comment.author.image ||
            'https://static.vecteezy.com/system/resources/previews/002/608/327/non_2x/mobile-application-avatar-web-button-menu-digital-silhouette-style-icon-free-vector.jpg',
          following: false, // Cần cập nhật nếu có chức năng follow
        },
      },
    };
  }

  async getComments(slug: string) {
    // Kiểm tra bài viết có tồn tại không
    const article = await this.databaseServices.article.findUnique({
      where: { slug },
      select: { id: true }, // Chỉ lấy id để tối ưu truy vấn
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Lấy tất cả comment của bài viết
    const comments = await this.databaseServices.comment.findMany({
      where: { articleId: article.id },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' }, // Sắp xếp theo thời gian tạo
    });

    return {
      comments: comments.map((comment) => ({
        id: comment.id,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        body: comment.body,
        author: {
          username: comment.author.username,
          bio: comment.author.bio,
          image:
            comment.author.image ||
            'https://static.vecteezy.com/system/resources/previews/002/608/327/non_2x/mobile-application-avatar-web-button-menu-digital-silhouette-style-icon-free-vector.jpg',
          following: false, // Có thể cập nhật sau nếu có chức năng follow
        },
      })),
    };
  }

  async deleteComment(slug: string, commentId: number, userId: number) {
    // Tìm bài viết theo slug
    const article = await this.databaseServices.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Tìm comment theo ID và kiểm tra quyền xoá
    const comment = await this.databaseServices.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Xoá comment
    await this.databaseServices.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }

  async favoriteArticle(slug: string, userId: number) {
    const article = await this.databaseServices.article.findUnique({
      where: { slug },
      include: { favoritedBy: true, author: true, tagList: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Kiểm tra nếu user chưa favorited thì thêm vào danh sách
    const alreadyFavorited = article.favoritedBy.some(
      (user) => user.id === userId,
    );
    if (!alreadyFavorited) {
      await this.databaseServices.article.update({
        where: { slug },
        data: { favoritedBy: { connect: { id: userId } } },
      });
    }

    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList.map((tag) => tag.name), // Trả về danh sách tags đúng định dạng
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: true, // User đã yêu thích bài viết này
        favoritesCount: article.favoritedBy.length + (alreadyFavorited ? 0 : 1), // Cập nhật số lượng yêu thích
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image:
            article.author.image ||
            'https://static.vecteezy.com/system/resources/previews/002/608/327/non_2x/mobile-application-avatar-web-button-menu-digital-silhouette-style-icon-free-vector.jpg',
          following: false, // Cần cập nhật nếu có chức năng follow
        },
      },
    };
  }

  async unfavoriteArticle(slug: string, userId: number) {
    const article = await this.databaseServices.article.findUnique({
      where: { slug },
      include: { favoritedBy: true, author: true, tagList: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Kiểm tra nếu user đã favorited trước đó thì mới xóa
    const alreadyFavorited = article.favoritedBy.some(
      (user) => user.id === userId,
    );

    if (alreadyFavorited) {
      await this.databaseServices.article.update({
        where: { slug },
        data: { favoritedBy: { disconnect: { id: userId } } },
      });
    }

    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList.map((tag) => tag.name),
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: false, // Đã bỏ favorite
        favoritesCount: article.favoritedBy.length - (alreadyFavorited ? 1 : 0),
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image:
            article.author.image ||
            'https://static.vecteezy.com/system/resources/previews/002/608/327/non_2x/mobile-application-avatar-web-button-menu-digital-silhouette-style-icon-free-vector.jpg',
          following: false, // Cập nhật theo logic follow
        },
      },
    };
  }
}
