import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  Put,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  Pagination,
  PaginationParams,
} from '@nnpp/decorators/pagination.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { ArticleResponseDto, CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Identity } from '@nnpp/decorators/identity.decorator';
import { Public } from '@nnpp/decorators';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DatabaseService } from '@nnpp/database';

@Controller()
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private databseServices: DatabaseService,
  ) {}

  @Public()
  @Get('articles')
  @ApiResponse({ type: ArticleResponseDto }) // ✅ Định nghĩa kiểu trả về cho Swagger
  async getArticles(
    @Pagination() pagination: PaginationParams = { limit: 10, offset: 0 }, // Giá trị mặc định
    @Query('tag') tag?: string,
    @Query('author') author?: string,
    @Query('favorited') favorited?: string,
  ) {
    return this.articleService.getArticles({
      tag,
      author,
      favorited,
      pagination: pagination || { limit: 10, offset: 0 }, // Đảm bảo pagination không undefined
    });
  }

  @Post('articles')
  @UseGuards(AuthGuard) // Authentication required
  async createArticle(
    @Body('article') createArticleDto: CreateArticleDto,
    @Identity() user,
  ) {
    return this.articleService.createArticle(createArticleDto, user.id);
  }

  @Public()
  @Get('/articles/:slug')
  async getArticleBySlug(@Param('slug') slug: string) {
    const article = await this.articleService.getArticleBySlug(slug);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return { article };
  }

  @Put('/articles/:slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @Body('article') articleData: UpdateArticleDto,
    @Identity() user, // Lấy thông tin user từ token
  ) {
    return this.articleService.updateArticle(slug, articleData, user.id);
  }

  @Delete('/articles/:slug')
  @UseGuards(AuthGuard) // Bắt buộc xác thực
  async deleteArticle(
    @Param('slug') slug: string,
    @Identity() user, // Lấy user từ request
  ) {
    return this.articleService.deleteArticle(slug, user.id);
  }

  @Post('/articles/feed')
  @UseGuards(AuthGuard) // Yêu cầu authentication
  async getFeedArticles(
    @Identity() user, // Lấy thông tin người dùng từ JWT
    @Pagination() pagination: PaginationParams, // Lấy các tham số phân trang (limit, offset)
  ) {
    const userId = user.id; // Lấy userId từ thông tin người dùng trong JWT
    const { limit, offset } = pagination; // Lấy limit và offset từ query params
    return this.articleService.getFeedArticles(
      userId, // Truyền userId vào service
      limit, // Truyền limit
      offset, // Truyền offset
    );
  }

  @Post('/articles/:slug/comments')
  @UseGuards(AuthGuard) // Bắt buộc xác thực
  async addComment(
    @Param('slug') slug: string,
    @Body('comment') commentData: { body: string },
    @Identity() user, // Lấy user từ request
  ) {
    if (!commentData.body) {
      throw new BadRequestException('Comment body is required');
    }
    return this.articleService.addComment(slug, user.id, commentData.body);
  }

  @Public()
  @Get('/articles/:slug/comments')
  async getComments(@Param('slug') slug: string) {
    return this.articleService.getComments(slug);
  }

  @Delete('/articles/:slug/comments/:id')
  @UseGuards(AuthGuard)
  async deleteComment(
    @Param('slug') slug: string,
    @Param('id', ParseIntPipe) commentId: number,
    @Identity() user, // Middleware lấy thông tin user từ JWT
  ) {
    return this.articleService.deleteComment(slug, commentId, user.id);
  }

  @Post('/articles/:slug/favorite')
  @UseGuards(AuthGuard)
  async favoriteArticle(@Param('slug') slug: string, @Identity() user) {
    const userId = user.id; // Lấy ID user từ request (do middleware auth cung cấp)
    return this.articleService.favoriteArticle(slug, userId);
  }

  @Delete('/articles/:slug/favorite')
  @UseGuards(AuthGuard)
  async unfavoriteArticle(@Param('slug') slug: string, @Identity() user) {
    const userId = user.id;
    return this.articleService.unfavoriteArticle(slug, userId);
  }
}
