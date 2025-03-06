import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { IS_PUBLIC_KEY } from '@nnpp/decorators'; // Import decorator
  import { JWT_SECRET } from '../../constant';
import { UsersService } from '../users/users.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private reflector: Reflector,
      private userService: UsersService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      
      // Kiểm tra nếu là endpoint public, không cần xác thực token
      if (isPublic) {
        console.log('🚨 Endpoint is public, skipping authentication');
        return true;
      }
      
      const token = this.extractTokenFromHeader(request);
      console.log('Token Extracted:', token);  // Log token sau khi extract từ header
  
      if (!token) {
        console.warn('🚨 Không tìm thấy token trong request headers');
        throw new UnauthorizedException('Token is required');
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: JWT_SECRET,
        });
        console.log('✅ JWT Payload:', payload); // Log payload để kiểm tra
  
        const foundUser = await this.userService.findOrFailById(payload.sub);
        if (!foundUser) {
          console.warn(`🚨 Không tìm thấy user với ID: ${payload.sub}`);
        } else {
          console.log('✅ Found User:', foundUser);
        }
  
        request['user'] = foundUser;
      } catch (error) {
        console.error('🚨 Lỗi xác thực JWT:', error);
        throw new UnauthorizedException('Token is invalid');
      }
  
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      console.log('Request Headers:', request.headers); // Log tất cả headers để kiểm tra
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  