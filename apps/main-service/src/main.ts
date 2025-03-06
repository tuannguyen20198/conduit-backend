import { NestFactory, Reflector } from '@nestjs/core';
import { setupApiServer } from '@nnpp/setup/setup-api-server';
import { AppModule } from './app.module';
import { config } from './config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as yaml from 'yaml';
import { TransformInterceptor } from '@nnpp/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor());

  // Thiết lập Global Prefix để đảm bảo Swagger hiển thị /api/ trong đường dẫn
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Conduit API')
    .setDescription('API documentation for Conduit')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Xuất Swagger thành YAML
  const yamlDocument = yaml.stringify(document);
  writeFileSync('./swagger.yml', yamlDocument, 'utf8');

  await setupApiServer({
    app,
    appConfig: {
      appName: config.APP_NAME,
      appPort: config.APP_PORT,
      globalPrefix: 'api', // Đảm bảo API có prefix /api
    },
    swaggerConfig: {
      title: 'Conduit API',
      description: 'Conduit API description',
      version: '1.0',
    },
  });
}
bootstrap();