import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Public } from '@nnpp/decorators';
import { ResponseMessage } from '@nnpp/decorators/message.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @ResponseMessage("Get all tags")
  @Get()
  async getTags() {
    return this.tagsService.findAll();
  }
}
