import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { DatabaseModule } from './database/database.module';
import { DomainModule } from './domain/domain.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@nnpp/interceptors';
import { ConfigModule } from '@nestjs/config';
import { config, validate } from './config';
import { DatabaseModule } from '@nnpp/database';
import { AppService } from './app.services';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// Inversion of control
// Container

@Module({
  imports: [
    // Infrastructure
    // DatabaseModule,
    ConfigModule.forRoot({
      validate,
    }),

    DatabaseModule.forRoot({
      dbUsername: config.DB_USERNAME,
      dbPassword: config.DB_PASSWORD,
      dbHost: config.DB_HOST,
      dbPort: config.DB_PORT,
      dbName: config.DB_NAME,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 110,
        },
      ],
    }),
    // Business
    DomainModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}