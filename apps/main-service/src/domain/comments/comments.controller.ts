import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Identity } from '../auth/identity.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('article')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard) // Bảo vệ route bằng JWT
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post(':slug/comments')
  async addComment(
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
    @Identity() user
  ) {
    return this.commentsService.create(slug, createCommentDto.comment.body, user.id);
  }
}
