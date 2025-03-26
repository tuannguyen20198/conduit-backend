import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { setupApiServer } from '@nnpp/setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS một lần duy nhất
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const appConfig = {
    appName: 'MyApp',
    appPort: 3000,
    globalPrefix: 'api', // Ví dụ, API sẽ có tiền tố /api
  };

  const swaggerConfig = {
    title: 'My API',
    description: 'Description of my API',
    version: '1.0',
  };

  // Sử dụng setupApiServer để cấu hình và khởi động ứng dụng
  await setupApiServer({
    app,
    appConfig,
    swaggerConfig,
  });

  console.log(
    `Application is running on: http://localhost:${appConfig.appPort}`,
  );
}

bootstrap();
