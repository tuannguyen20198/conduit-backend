import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProfileResponseDto } from './dto/create-profile.dto';
import { DatabaseService } from '@nnpp/database';

@Injectable()
export class ProfileService {
  constructor(private databaseService: DatabaseService) {}

  async getProfileByUserName(username: string, currentUserId?: number) {
    const user = await this.databaseService.user.findUnique({
      where: { username },
      include: { followedBy: true },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const isFollowing = currentUserId
      ? user.followedBy.some((follower) => follower.id === currentUserId)
      : false;
  
    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: isFollowing,
      },
    };
  }
  
  // Follow user
  // ✅ FOLLOW USER
  async followByOneUser(followerId: number, username: string) {
    const userToFollow = await this.databaseService.user.findUnique({
      where: { username },
      include: { followedBy: true },
    });

    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    await this.databaseService.user.update({
      where: { id: userToFollow.id },
      data: {
        followedBy: {
          connect: { id: followerId }, // Thêm follower vào danh sách `followedBy`
        },
      },
    });

    return this.getProfileByUserName(username, followerId); // Trả về profile mới
  }

  // ✅ UNFOLLOW USER
  async unfollowByOneUser(followerId: number, username: string) {
    const userToUnfollow = await this.databaseService.user.findUnique({
      where: { username },
      include: { followedBy: true },
    });

    if (!userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    await this.databaseService.user.update({
      where: { id: userToUnfollow.id },
      data: {
        followedBy: {
          disconnect: { id: followerId }, // Xóa follower khỏi danh sách `followedBy`
        },
      },
    });

    return this.getProfileByUserName(username, followerId); // Trả về profile mới
  }
}
