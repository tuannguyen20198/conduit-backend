import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService,UserService],
  exports: [ArticleService],
})
export class ArticleModule {}
