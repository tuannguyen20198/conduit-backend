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
  APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 4000,
  APP_NAME: process.env.APP_NAME ?? 'main-service',
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: parseInt(process.env.DB_PORT, 10),
  DB_NAME: process.env.DB_NAME,
};