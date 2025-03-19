import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@nnpp/database';

@Injectable()
export class TagService {
  constructor(private databaseServices: DatabaseService) {}
  async getTags() {
    return this.databaseServices.tag.findMany({
      select: {
        name: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      take: 10,
    });
  }
}
