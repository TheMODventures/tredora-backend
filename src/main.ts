import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorLoggingFilter } from './common/exceptions/error-middleware';
import { LoggingInterceptor } from './common/interceptor/logging-interceptor';
import { setupSwagger } from './utils/swagger-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api/v1');

  // Setup Swagger documentation
  setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422,
    }),
  );

  app.useGlobalFilters(new ErrorLoggingFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
  );

  await app.listen(process.env.PORT ?? 5163);
  console.log(`Application is running on PORT -> ${process.env.PORT ?? 5163}`);
}
bootstrap();