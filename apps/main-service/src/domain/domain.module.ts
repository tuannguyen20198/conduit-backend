import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ProfileModule } from './profile/profile.module';
import { ArticleModule } from './article/article.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { AuthGuard } from './auth/auth.grand';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Inversion of control
// Container
@Module({
  imports: [ 
    UserModule,
    UsersModule,
    ProfileModule, 
    ArticleModule,
    AuthModule,
    CommentsModule,
    TagsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class DomainModule {}