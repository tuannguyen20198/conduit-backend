import { NestFactory, Reflector } from '@nestjs/core';
import { setupApiServer } from '@nnpp/setup/setup-api-server';
import { AppModule } from './app.module';
import { SerializeInterceptor } from '@nnpp/interceptors';
import { config } from './config';
import { TransformInterceptor } from '@nnpp/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SerializeInterceptor());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  await setupApiServer({
    app,
    appConfig: {
      appName: config.APP_NAME,
      appPort: config.APP_PORT,
      globalPrefix: 'api',
    },
    swaggerConfig: {
      title: 'Todolist example',
      description: 'Todolist API description',
      version: '1.0',
    },
  });
}
bootstrap();