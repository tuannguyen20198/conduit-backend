import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class LoginDto {
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

export class RequestLoginDto {
  @ApiProperty({
    description: 'User to be created',
    type: LoginDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoginDto)
  user: LoginDto;
}
