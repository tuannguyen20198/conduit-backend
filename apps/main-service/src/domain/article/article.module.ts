import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService,UsersService],
  exports: [ArticleService],
})
export class ArticleModule {}
