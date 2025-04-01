import { PartialType } from '@nestjs/mapped-types';
import { ArticleResponseDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(ArticleResponseDto) {}
