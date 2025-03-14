import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

interface DatabaseModuleOptions {
  dbUsername: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
  dbName: string;
}

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    if (!options.dbUsername || !options.dbPassword || !options.dbHost || !options.dbPort || !options.dbName) {
      throw new Error('❌ DatabaseModuleOptions is invalid or missing!');
    }

    // Set lại biến môi trường DATABASE_URL
    const databaseUrl = `postgresql://${options.dbUsername}:${options.dbPassword}@${options.dbHost}:${options.dbPort}/${options.dbName}?schema=public`;
    process.env.DATABASE_URL = databaseUrl;
    console.log('🔧 DATABASE_URL set to:', process.env.DATABASE_URL);

    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService, // Không cần truyền options vào DatabaseService
      ],
      exports: ['DATABASE_OPTIONS', DatabaseService],
    };
  }
}
