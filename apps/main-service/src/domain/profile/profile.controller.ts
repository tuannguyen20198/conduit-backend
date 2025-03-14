import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Identity } from '@nnpp/decorators/identity.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(@Param('username') username: string, @Identity() user?: User) {
    return this.profileService.getProfileByUserName(username, user?.id);
  }

 // ✅ FOLLOW USER
 @UseGuards(AuthGuard) // Chỉ user đã đăng nhập mới follow được
 @Post(':username/follow')
 async followUser(@Param('username') username: string, @Identity() user) {
   const followedProfile = await this.profileService.followByOneUser(
     user.id,
     username,
   );

   if (!followedProfile) {
     throw new NotFoundException('User not found');
   }

   return followedProfile; // Trả về profile của người dùng vừa được follow
 }

 // ✅ UNFOLLOW USER
 @UseGuards(AuthGuard) // Chỉ user đã đăng nhập mới unfollow được
 @Delete(':username/follow')
 async unfollowUser(@Param('username') username: string, @Identity() user) {
   const unfollowedProfile = await this.profileService.unfollowByOneUser(
     user.id,
     username,
   );

   if (!unfollowedProfile) {
     throw new NotFoundException('User not found');
   }

   return unfollowedProfile; // Trả về profile của người dùng vừa bị unfollow
 }

}