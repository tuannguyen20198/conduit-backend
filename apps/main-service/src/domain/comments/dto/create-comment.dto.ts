import { IsNotEmpty, IsString } from 'class-validator';

class CommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comment body cannot be empty' })
  body: string;
}

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Comment object cannot be empty' })
  comment: CommentDto;
}