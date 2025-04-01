import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestCreateUserDto } from './dto/create-user.dto';
import { ApiOperationDecorator, Public } from '@nnpp/decorators';
import { UserResponseWrapperDto } from './dto/user.response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Identity } from '@nnpp/decorators/identity.decorator';
import { User } from '@prisma/client';
import { RequestLoginDto } from './dto/login.dto';
import { RequestUpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '@nnpp/database';

@ApiBearerAuth()
@ApiTags('User')
@Controller()
export class UserController {
  private readonly logger: Logger;

  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
  ) {
    this.logger = new Logger(UserController.name);
  }

  @ApiOperationDecorator({
    operationId: 'createUser',
    summary: 'Create a new user',
    description: 'Create a new user',
    type: UserResponseWrapperDto,
  })
  @Public()
  @Post('/users')
  async createUser(@Body() data: RequestCreateUserDto) {
    try {
      this.logger.log('[createUser] Creating user...');

      const user = await this.userService.createUser(data.user);
      const token = await this.userService.generateJwt(user);

      this.logger.log('[createUser] User created successfully');
      return new UserResponseWrapperDto(user, token);
    } catch (error) {
      this.logger.error('[createUser] Error creating user', error);
      throw error;
    }
  }

  @ApiOperationDecorator({
    operationId: 'login',
    summary: 'Login',
    description: 'Login',
    type: UserResponseWrapperDto,
  })
  @Public()
  @Post('/users/login')
  async login(@Body() data: RequestLoginDto) {
    const user = await this.userService.login(data.user);
    const token = await this.userService.generateJwt(user);

    return new UserResponseWrapperDto(user, token);
  }

  @ApiOperationDecorator({
    operationId: 'getCurrentUser',
    summary: 'Get current user',
    description: 'Get current user',
    type: UserResponseWrapperDto,
  })
  @Get('/user')
  async getMe(@Identity() user: User) {
    const token = await this.userService.generateJwt(user);
    return new UserResponseWrapperDto(user, token);
  }

  @ApiOperationDecorator({
    operationId: 'updateCurrentUser',
    summary: 'Update current user',
    description: 'Update current user',
    type: UserResponseWrapperDto,
  })
  @Put('user')
  async updateUser(@Identity() user, @Body('user') updateData: Partial<User>) {
    const userId = user.id; // ✅ Lấy userId từ token
    return this.userService.updateUserById(user.id, updateData);
  }
}
