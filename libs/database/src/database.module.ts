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
  imports: [ConfigModule], // Import ConfigModule vào DatabaseModule
})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useFactory: async (configService: ConfigService) => {
            // Lấy các giá trị từ .env thông qua ConfigService
            const dbUsername = configService.get<string>('DB_USERNAME');
            const dbPassword = configService.get<string>('DB_PASSWORD');
            const dbHost = configService.get<string>('DB_HOST');
            const dbPort = configService.get<number>('DB_PORT');
            const dbName = configService.get<string>('DB_NAME');

            if (!dbUsername || !dbPassword || !dbHost || !dbPort || !dbName) {
              throw new Error('❌ DatabaseModuleOptions is invalid or missing!');
            }

            // Set lại biến môi trường DATABASE_URL
            const databaseUrl = `postgresql://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;
            process.env.DATABASE_URL = databaseUrl;
            console.log('🔧 DATABASE_URL set to:', process.env.DATABASE_URL);

            return {
              dbUsername,
              dbPassword,
              dbHost,
              dbPort,
              dbName,
            };
          },
          inject: [ConfigService], // Inject ConfigService vào provider
        },
        DatabaseService, // Không cần truyền options vào DatabaseService nữa
      ],
      exports: ['DATABASE_OPTIONS', DatabaseService],
    };
  }
}
