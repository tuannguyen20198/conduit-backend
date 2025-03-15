import { NestFactory } from '@nestjs/core';
import { setupApiServer } from '@nnpp/setup/setup-api-server';
import { AppModule } from './app.module';
import { config } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS để Swagger có thể gửi request đến API
  app.enableCors({
    origin: '*', // Hoặc thay bằng ['http://localhost:3000', 'https://your-frontend.com']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Nếu API yêu cầu gửi cookies hoặc token trong header
  });

  await setupApiServer({
    app,
    appConfig: {
      appName: config.app.name,
      appPort: config.app.port,
      globalPrefix: 'api',
    },
    swaggerConfig: {
      title: 'Conduit APIs',
      description: 'Conduit API description',
      version: '1.0',
    },
  });

  // Định nghĩa cấu hình Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Conduit APIs')
    .setDescription('Conduit API description')
    .setVersion('1.0')
    .addBearerAuth() // Nếu API cần xác thực
    .addServer('http://localhost:3000')
    .build();

  // Tạo tài liệu Swagger chính xác
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, swaggerDocument); // Sửa lỗi đường dẫn Swagger

  // Ghi file JSON (tùy chọn)
  writeFileSync('./swagger.json', JSON.stringify(swaggerDocument, null, 2));
}
bootstrap();
