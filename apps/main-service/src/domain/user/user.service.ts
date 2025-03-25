import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '@nnpp/database';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { config } from '../../config';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async createUser(data: CreateUserDto) {
    const [foundUserByEmail, foundUserByUsername] = await Promise.all([
      this.findByEmail(data.email),
      this.findByUsername(data.username),
    ]);

    if (foundUserByEmail || foundUserByUsername) {
      throw new UnprocessableEntityException('User already exists');
    }

    return this.databaseService.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.password,
      },
    });
  }

  async login(data: LoginDto) {
    const foundUser = await this.findByEmail(data.email);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (foundUser.password !== data.password) {
      throw new UnprocessableEntityException('Invalid password');
    }

    return foundUser;
  }

  async updateUserById(userId: number, updateData: Partial<User>) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.databaseService.user.update({
      where: { id: userId },
      data: updateData, // ✅ Bỏ `user` bọc ngoài
    });

    delete updatedUser.password; // ✅ Xóa password trước khi trả về
    return { user: updatedUser };
  }

  async findByEmail(email: string) {
    return await this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return await this.databaseService.user.findUnique({
      where: { username },
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
      throw new NotFoundException('User not found');
    }
    return user;
  }

  generateJwt(user: User) {
    return this.jwtService.signAsync({
      iss: config.jwt.issuer,
      sub: user.id,
    });
  }
}
