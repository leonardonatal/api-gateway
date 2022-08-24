import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggInterceptor } from './common/interceptors/logging.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(8080);
}
bootstrap();
