import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ResponseMessage } from '@nnpp/decorators/message.decorator';
import { Identity } from '../users/identity.decorator';
import { AuthGuard } from '../auth/auth.grand';

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
  @Get(":slug/comments")
  async findAll() {
    return this.commentsService.findAll();
  }
  @UseGuards(AuthGuard) // Chỉ cho phép user đã đăng nhập xóa comment
  @Delete(':slug/comments/:id')
  async deleteComment(
    @Param('slug') slug: string,
    @Param('id') commentId: string,
    @Identity() user // Lấy thông tin user từ request
  ) {
    return this.commentsService.deleteComment(slug, parseInt(commentId), user.id);
  }

  @UseGuards(AuthGuard) // Chỉ cho phép user đã đăng nhập thêm favorite
  @ResponseMessage("Favorite Success")
  @Post(':slug/favorite')
  async favoriteArticle(
    @Param('slug') slug: string,
    @Identity() user // Lấy thông tin user từ request
  ) {
    return this.commentsService.favoriteArticle(slug, user.id);
  }
  @UseGuards(AuthGuard)
  @ResponseMessage("UnFavorite Success")
  @Delete(':slug/favorite')
  async unfavoriteArticle(@Param('slug') slug: string, @Identity() user) {
    return this.commentsService.unfavoriteArticle(slug, user.id);
  }
}
