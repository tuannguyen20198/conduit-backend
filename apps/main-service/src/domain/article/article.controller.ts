import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseMessage } from '@nnpp/decorators/message.decorator';
import { Public } from '@nnpp/decorators';
import { Identity } from '../auth/identity.decorator';
import { Article } from '@prisma/client';

@Controller('/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Public()
  @Get()
  @ResponseMessage('Get all articles')
  async getArticles(
    @Query('current') currentPage : number,
    @Query('pageSize') limit : number,
    @Query() queryParams: any,
  ) {
    return this.articleService.findAll(Number(currentPage), Number(limit), queryParams);
  }

  @Post()
  @UseGuards(AuthGuard) // Require Authentication
  async create(@Identity() user, @Body('article') createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(user.id, createArticleDto);
  }

  @UseGuards(AuthGuard) // Apply the JwtAuthGuard to protect the route
  @Get('/feed')
  async findFeed(
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query('tags') tags: string,
    @Identity() user,  // To access the request object and get user information
  ) {
    // Extract the user ID from the request (assuming the JWT payload contains userId)
    const userId = user?.id; // This assumes user data is attached to the request by the guard

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Convert currentPage and pageSize to numbers
    const page = Number(currentPage) || 1;
    const size = Number(pageSize) || 10;

    // Pass the userId and query parameters to the service method
    return this.articleService.findFeed(page, size, userId, tags || '');
  }

  @Public()
  @ResponseMessage("Get article by slug")
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    // Call the service method to retrieve the article by its slug
    const article = await this.articleService.findOneBySlug(slug);

    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  @UseGuards(AuthGuard)
  @Post(':slug')
  @ResponseMessage("Update article by slug")
  async update(@Param('slug') slug: string, @Body() updateArticleDto: UpdateArticleDto) {
    try {
      // Gọi service để cập nhật bài viết theo slug và dữ liệu từ DTO
      const updatedArticle = await this.articleService.update(slug, updateArticleDto);
      console.log(updatedArticle)
      if (!updatedArticle) {
        throw new Error('Article not found or update failed');
      }
  
      return updatedArticle; // Trả về bài viết đã được cập nhật
    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }
}
