import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {  LoginDto, registerUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { Public } from '@nnpp/decorators';
import { Identity } from './identity.decorator';
import { RESPONSE_MESSAGE, ResponseMessage } from '@nnpp/decorators/message.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 50000 } })
  @Post('login')
  signIn(@Body() data: LoginDto) {
    return this.userService.signIn(data.email, data.password);
  }
  @Public()
  @Post('')
  async createUser(@Body() data: registerUserDto) {
    const user = await this.userService.createUser(data);
    return {user};
  }
}
