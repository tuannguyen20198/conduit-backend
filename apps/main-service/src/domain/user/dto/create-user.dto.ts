import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username of the user',
    type: String,
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email of the user',
    type: String,
    example: 'john@nnpp.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    type: String,
    example: 'abc123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RequestCreateUserDto {
  @ApiProperty({
    description: 'User to be created',
    type: CreateUserDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
