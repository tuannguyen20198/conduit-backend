import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupApiServer = async ({
  app,
  appConfig,
  swaggerConfig,
}: {
  app: INestApplication;
  appConfig: {
    appName: string;
    appPort: number;
    globalPrefix?: string;
  };
  swaggerConfig?: {
    title: string;
    description: string;
    version: string;
  };
}) => {
  app.setGlobalPrefix(appConfig.globalPrefix);

  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
      validationError: {
        target: false,
      },
      transform: true,
    }),
  );

  await app.listen(appConfig.appPort);

  console.table({
    appName: appConfig.appName,
    appPort: appConfig.appPort,
  });
};
