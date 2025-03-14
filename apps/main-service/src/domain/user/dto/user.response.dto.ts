import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    example: 'john@nnpp.com',
  })
  email: string;

  @ApiProperty({
    description: 'Token of the user',
    type: String,
    example: 'token',
  })
  token: string;

  @ApiProperty({
    description: 'Username of the user',
    type: String,
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Bio of the user',
    type: String,
    example: 'I am a software engineer',
  })
  bio: string;

  @ApiProperty({
    description: 'Image of the user',
    type: String,
    example: 'https://example.com',
  })
  @Expose()
  image: string;
}

export class UserResponseWrapperDto {
  @ApiProperty({
    description: 'User response',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  constructor(props: User, token: string) {
    this.user = {
      email: props.email,
      token,
      username: props.username,
      bio: props.bio,
      image: props.image,
    };
  }
}
