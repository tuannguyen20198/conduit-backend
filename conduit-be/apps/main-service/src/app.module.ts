import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@nnpp/database';
import { config, validate } from './config';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Đảm bảo biến môi trường có sẵn toàn bộ ứng dụng
      envFilePath: '.env', // Đọc tệp .env
    }),
    DomainModule,
    DatabaseModule.forRoot(), // Không truyền tham số nữa
  ],
})
export class AppModule {}
