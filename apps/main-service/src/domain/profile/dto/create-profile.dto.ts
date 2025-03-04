import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  bio?: string;

  @IsString()
  image?: string;
}

export class FollowDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
