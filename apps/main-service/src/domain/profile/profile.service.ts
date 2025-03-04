import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '@nnpp/database';

@Injectable()
export class ProfileService {
  constructor(private databaseService: DatabaseService) {}

  async getProfile(username: string, currentUserId?: number) {
    const user = await this.databaseService.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        image: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    let following = false;
    if (currentUserId) {
      const follow = await this.databaseService.follower.findFirst({
        where: { user_id: currentUserId, following_id: user.id },
      });
      following = !!follow;
    }

    return { profile: { ...user, following } };
  }

  async followUser(username: string, currentUserId: number) {
    const user = await this.databaseService.user.findUnique({ where: { username } });

    if (!user) throw new NotFoundException('User not found');
    if (user.id === currentUserId) throw new BadRequestException('Cannot follow yourself');

    const existingFollow = await this.databaseService.follower.findFirst({
      where: { user_id: currentUserId, following_id: user.id },
    });

    if (!existingFollow) {
      await this.databaseService.follower.create({
        data: {
          user_id: currentUserId,
          following_id: user.id,
        },
      });
    }

    return { profile: { ...user, following: true } };
  }

  async unfollowUser(username: string, currentUserId: number) {
    const user = await this.databaseService.user.findUnique({ where: { username } });

    if (!user) throw new NotFoundException('User not found');

    await this.databaseService.follower.deleteMany({
      where: { user_id: currentUserId, following_id: user.id },
    });

    return { profile: { ...user, following: false } };
  }
}
