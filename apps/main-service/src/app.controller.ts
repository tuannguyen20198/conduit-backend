import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.services';
import { Public } from '@nnpp/decorators';

// app.use('/api', router)
// router.get('/users', (req, res) => res.send('Hello World!'))
// /api/users

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get("/health")
  getHello(): string {
    console.log('health check');
    return 'Hello World!';
  }
}