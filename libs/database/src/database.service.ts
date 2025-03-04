import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
// import { constructDBUrl } from './utils';
// import { config } from '../config';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  // constructor() {
  //   const databaseUrl = constructDBUrl({
  //     dbUsername: config.DB_USERNAME,
  //     dbPassword: config.DB_PASSWORD,
  //     dbHost: config.DB_HOST,
  //     dbPort: config.DB_PORT,
  //     dbName: config.DB_NAME,
  //   });

  //   super({
  //     datasources: {
  //       db: {
  //         url: databaseUrl,
  //       },
  //     },
  //   });
  // }

  constructor(config: Prisma.PrismaClientOptions) {
    super(config);
  }

  async onModuleInit() {
    await this.$connect()
      .then(() => {
        this.logger.log('Database connected');
      })
      .catch(() => {
        this.logger.error('Database connection failed');
      });
  }
}