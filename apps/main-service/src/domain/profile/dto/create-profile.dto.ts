import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean, ValidateNested } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'jake' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'I work at statefarm', nullable: true })
  @IsString()
  bio: string | null;

  @ApiProperty({ example: 'https://api.realworld.io/images/smiley-cyrus.jpg', nullable: true })
  @IsString()
  image: string | null;

  @ApiProperty({ example: false })
  @IsBoolean()
  following: boolean;
}

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Profile information',
    type: CreateProfileDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;

  constructor(username: string, bio: string | null, image: string | null, following: boolean) {
    this.profile = { username, bio, image, following };
  }
}
