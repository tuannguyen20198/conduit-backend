import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@nnpp/database';

@Injectable()
export class TagsService {
  constructor(private databaseService:DatabaseService){}
  async findAll() {
    const tags = await this.databaseService.tag.findMany({
      select: { title: true }, // Chỉ lấy title của tag
    });

    return { tags: tags.map((tag) => tag.title) };
  }
}
