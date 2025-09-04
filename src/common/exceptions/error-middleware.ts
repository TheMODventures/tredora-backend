import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorLoggingFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;

    let message = 'Internal server error';

    if (exception?.response?.message) {
      message = Array.isArray(exception.response.message)
        ? exception.response.message[0]
        : exception.response.message;
    } else if (exception?.message) {
      message = exception.message.replace(/\"/g, '');
    }

    response.status(statusCode).json({ statusCode, message });
  }
}