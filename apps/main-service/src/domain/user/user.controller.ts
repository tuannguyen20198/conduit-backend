import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Identity } from '../users/identity.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getMe(@Identity() user: User) {
    return {user};
  }
  
  @Patch('')
  async updateMe(@Identity() user: User, @Body() updateDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(user.id, updateDto);
    return {
      user: updatedUser,
    };
  }
}
