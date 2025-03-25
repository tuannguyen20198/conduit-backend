import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

interface DatabaseModuleOptions {
  dbUsername: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
  dbName: string;
}

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })], // Load .env toàn cục
})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useFactory: async (
            configService: ConfigService,
          ): Promise<DatabaseModuleOptions> => {
            const dbUsername = configService.get<string>('DB_USERNAME');
            const dbPassword = configService.get<string>('DB_PASSWORD');
            const dbHost = configService.get<string>('DB_HOST');
            const dbPort = configService.get<number>('DB_PORT');
            const dbName = configService.get<string>('DB_NAME');

            if (!dbUsername || !dbPassword || !dbHost || !dbPort || !dbName) {
              throw new Error(
                '❌ DatabaseModuleOptions is invalid or missing!',
              );
            }

            // Cập nhật DATABASE_URL
            const databaseUrl = `postgresql://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;
            process.env.DATABASE_URL = databaseUrl;

            console.log('✅ DATABASE_URL:', databaseUrl);

            return { dbUsername, dbPassword, dbHost, dbPort, dbName };
          },
          inject: [ConfigService],
        },
        DatabaseService,
      ],
      exports: ['DATABASE_OPTIONS', DatabaseService],
    };
  }
}
