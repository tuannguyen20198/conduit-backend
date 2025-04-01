import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  APP_PORT: string;

  @IsOptional()
  APP_NAME: string;

  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNotEmpty()
  DB_HOST: string;

  @IsNotEmpty()
  DB_USERNAME: string;

  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsNotEmpty()
  DB_PORT: number;

  @IsNotEmpty()
  DB_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export const config = {
  app: {
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 4000,
    name: process.env.APP_NAME,
  },
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    issuer: process.env.JWT_ISSUER ?? 'issuer',
  },
};
