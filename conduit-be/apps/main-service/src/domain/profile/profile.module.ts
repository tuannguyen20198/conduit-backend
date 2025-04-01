import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ProfileController],
  exports: [ProfileService],
  providers: [ProfileService,UserService]
})
export class ProfileModule {}
