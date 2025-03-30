import { ApiProperty } from '@nestjs/swagger';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  @IsOptional()
  tagList?: string[];
}

export class ArticleResponseDto {
  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [String] })
  tagList: string[];

  @ApiProperty()
  favorited: boolean;

  @ApiProperty()
  favoritesCount: number;

  @ApiProperty({ type: () => CreateProfileDto })
  author: CreateProfileDto;
}
