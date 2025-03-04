import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DatabaseService } from '@nnpp/database';
import { JWT_SECRET,BCRYPT_ROUNDS } from '../../constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}


  async updateUser(userId: number, updateDto: UpdateUserDto) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: updateDto,
    });
  }
  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }
  async findOrFailById(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}