import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@nnpp/database';

@Injectable()
export class TagService {
  constructor(private databaseServices: DatabaseService) {}
  async getTags() {
    return this.databaseServices.tag.findMany({
      select: { name: true },
    });
  }
}
