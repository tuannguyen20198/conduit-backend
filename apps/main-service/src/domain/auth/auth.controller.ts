import { AuthService } from './auth.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignInDto } from './dto/sigin-in.dto';
import { Public } from '@nnpp/decorators';
import { ResponseMessage } from '@nnpp/decorators/message.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserDto } from '../user/dto/create-user.dto';

// class decorator
// method decorator
// param decorator
// property decorator

@Controller('auth')
export class AuthController {
  // shorthand syntax
  constructor(private authService: AuthService) {}
  // constructor(@Inject(AuthService) private authService: AuthService) {}

  @Public()
  @ResponseMessage('Login success')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 50000 } })
  @Post('/sign-in')
  signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data.email, data.password);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Create user successfully')
  async createUser(@Body() data: CreateUserDto) {
    const user = await this.authService.createUser(data);
    return {user};
  }
}