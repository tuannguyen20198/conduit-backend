import { NestFactory } from '@nestjs/core';
import { setupApiServer } from '@nnpp/setup/setup-api-server';
import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
}
bootstrap();
