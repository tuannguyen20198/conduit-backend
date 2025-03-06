import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@nnpp/database';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private databaseServices:DatabaseService){}
  async updateUser(userId: number, updateDto: UpdateUserDto) {
    return this.databaseServices.user.update({
      where: { id: userId },
      data: updateDto,
    });
  }
}
