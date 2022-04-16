import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggInterceptor } from './common/interceptors/logging.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as momentTimeZone from 'moment-timezone';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };
  await app.listen(8080);
}
bootstrap();
