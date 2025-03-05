import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [CommentsController],
  exports:[CommentsService],
  providers: [CommentsService,UserService],
})
export class CommentsModule {}
