import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const clientIp =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    this.logger.log(
      `Incoming request - Method: ${method}, URL: ${url}, ip: ${clientIp}`,
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`Outgoing response - ${Date.now() - now}ms`)),
      );
  }
}
