import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@nnpp/database';
import { config, validate } from './config';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),

    DatabaseModule.forRoot({
      dbUsername: config.db.username,
      dbPassword: config.db.password,
      dbHost: config.db.host,
      dbPort: config.db.port,
      dbName: config.db.name,
    }),

    DomainModule,
  ],
})
export class AppModule {}
