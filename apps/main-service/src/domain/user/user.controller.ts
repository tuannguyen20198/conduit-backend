import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { Public } from '@nnpp/decorators';
import { Identity } from '../auth/identity.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RESPONSE_MESSAGE, ResponseMessage } from '@nnpp/decorators/message.decorator';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @ResponseMessage('Get user successfully')
  getMe(@Identity() user: User) {
    return {user};
  }

  @Patch('')
  @ResponseMessage('Update user successfully')
  async updateMe(@Identity() user: User, @Body() updateDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(user.id, updateDto);
    return {
      user: updatedUser,
    };
  }
  @Post('/logout')
  @ResponseMessage('Logout successfully')
  @UseGuards(AuthGuard)
  logout(@Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    return { status: 200, message: 'Logout success' };
  }
}