import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Antes...');
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`Depois... ${Date.now() - now} ms`)));
  }
}
