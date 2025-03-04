import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ProfileModule } from './profile/profile.module';
import { ArticleModule } from './article/article.module';

// Inversion of control
// Container
@Module({
  imports: [ 
    UserModule, 
    AuthModule,
    ProfileModule, 
    ArticleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class DomainModule {}