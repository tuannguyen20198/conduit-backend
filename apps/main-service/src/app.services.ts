import { Injectable } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@nnpp/decorators/public.decorator';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}