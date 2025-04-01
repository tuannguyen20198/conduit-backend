import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { Public } from '@nnpp/decorators';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get()
  async getTags() {
    const tags = await this.tagService.getTags();
    return { tags: tags.map((tag) => tag.name) }; // Định dạng trả về theo RealWorld API
  }
}
