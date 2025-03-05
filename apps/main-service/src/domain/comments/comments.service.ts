import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
}
