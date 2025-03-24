import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS một lần duy nhất
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // Định nghĩa cấu hình Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Conduit APIs')
    .setDescription('Conduit API description')
    .setVersion('1.0')
    .addBearerAuth() // Nếu API cần xác thực
    .addServer('http://localhost:3000') // Đảm bảo URL cho Swagger
    .build();

  // Tạo tài liệu Swagger
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // Thiết lập Swagger UI tại /api/docs
  SwaggerModule.setup('/api/docs', app, swaggerDocument);

  // Ghi file Swagger (tuỳ chọn)
  writeFileSync('./swagger.json', JSON.stringify(swaggerDocument, null, 2));

  // Lấy cổng từ config hoặc mặc định
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 4000;
  // Chỉ gọi app.listen() một lần duy nhất
  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}

bootstrap();


