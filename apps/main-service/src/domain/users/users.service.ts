import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DatabaseService } from '@nnpp/database';
import { JWT_SECRET,BCRYPT_ROUNDS, JWT_ISSUER } from '../../constant';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
@Injectable()
export class UsersService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
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
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    };
  }

  async createUser(data: Prisma.UserCreateInput) {
    const foundEmail = await this.findByEmail(data.email);
    if (foundEmail) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: 'Email is already in use' },
        HttpStatus.BAD_REQUEST,
      );
    }
  
    const foundUsername = await this.databaseService.user.findUnique({
      where: { username: data.username },
    });
  
    if (foundUsername) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: 'Username is already taken' },
        HttpStatus.BAD_REQUEST,
      );
    }
  
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  
    const newUser = await this.databaseService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  
    return omit(newUser, ['password']); // Loại bỏ password trước khi trả về
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