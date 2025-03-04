import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BCRYPT_ROUNDS, JWT_ISSUER } from '../../constant';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@nnpp/database';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.findByEmail(email);
    console.log(user)
    if (!user) {
      throw new BadRequestException('Email or Password is incorrect');
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new BadRequestException('Email or Password is incorrect');
    }

    const payload = {
      iss: JWT_ISSUER,
      sub: user.id,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }
  async createUser(data: Prisma.UserCreateInput) {
    // Kiểm tra email đã tồn tại chưa
    const foundEmail = await this.findByEmail(data.email)

    if (foundEmail) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: 'Email is already in use' },
        HttpStatus.BAD_REQUEST,
      );
    }
  
    // Kiểm tra username đã tồn tại chưa
    const foundUsername = await this.databaseService.user.findUnique({
      where: { username: data.username },
    });
  
    if (foundUsername) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: 'Username is already taken' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // Mã hóa mật khẩu bằng bcrypt
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    // Tạo user mới trong DB
    return this.databaseService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
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