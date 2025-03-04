import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FollowDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { Identity } from '../auth/identity.decorator';
import { User } from '@prisma/client';
import { ResponseMessage } from '@nnpp/decorators/message.decorator';

@Controller('/profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Get(':username')
  @ResponseMessage('Get Profile User Success')
  async getProfile(@Param('username') username: string, @Identity() user: User | null) {
    return this.profileService.getProfile(username, user?.id);
  }

  @Post(':username/follow')
  @ResponseMessage('Follow Success')
  @UseGuards(AuthGuard)
  async followUser(@Param('username') username: string, @Identity() user: User) {
    return this.profileService.followUser(username, user.id);
  }

  @Delete(':username/follow')
  @ResponseMessage('UnFollow Success')
  @UseGuards(AuthGuard)
  async unfollowUser(@Param('username') username: string, @Identity() user: User) {
    return this.profileService.unfollowUser(username, user.id);
  }
}