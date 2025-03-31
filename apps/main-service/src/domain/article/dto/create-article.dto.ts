import { ApiProperty } from '@nestjs/swagger';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsArray({ message: 'tagList must be an array' })
  @IsNotEmpty({ message: 'Tag list cannot be empty' })
  tagList: string[];
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
