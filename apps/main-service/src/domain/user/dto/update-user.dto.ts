import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Username of the user',
    type: String,
    example: 'john_doe',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  username?: string;

  @ApiPropertyOptional({
    description: 'Password of the user',
    type: String,
    example: 'abc123',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @ApiPropertyOptional({
    description: 'Bio of the user',
    type: String,
    example: 'I am a software engineer',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Avatar of the user',
    type: String,
    example: 'https://example.com/avatar.png',
  })
  @IsString()
  @IsOptional()
  image?: string;
}

export class RequestUpdateUserDto {
  @ApiProperty({
    description: 'User to be updated',
    type: UpdateUserDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;
}
