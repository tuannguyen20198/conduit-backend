import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DomainModule } from '../domain.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
