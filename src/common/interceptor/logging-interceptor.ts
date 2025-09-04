import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

interface RequestWithExtras extends Request {
  body: Record<string, any>;
  query: Record<string, any>;
  params: Record<string, any>;
}

interface SanitizedData {
  [key: string]: any;
}

type SensitiveField = 'password' | 'token' | 'secret' | 'authorization';

@Injectable()
export class LoggingInterceptor implements NestInterceptor<any, any> {
  private readonly logger = new Logger('API');
  private readonly sensitiveFields: readonly SensitiveField[] = [
    'password',
    'token',
    'secret',
    'authorization',
  ] as const;

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request: RequestWithExtras = context
      .switchToHttp()
      .getRequest<RequestWithExtras>();
    const { method, url, body, query, params } = request;

    const timestamp: string = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const sanitizedBody: SanitizedData | null = this.sanitizeData(body);

    this.logger.log('\n' + '-'.repeat(80));
    this.logger.debug(`${timestamp}`);
    this.logger.debug(`${method} ${url}`);

    if (params && Object.keys(params).length > 0) {
      this.logger.debug(`Params: ${JSON.stringify(params)}`);
    }

    if (query && Object.keys(query).length > 0) {
      this.logger.debug(`Query: ${JSON.stringify(query)}`);
    }

    if (sanitizedBody && Object.keys(sanitizedBody).length > 0) {
      this.logger.debug(`Body: ${JSON.stringify(sanitizedBody)}`);
    }

    this.logger.log('\n' + '-'.repeat(80) + '\n');

    return next.handle().pipe(
      tap((): void => {
        this.logger.log(`✅ ${method} ${url} - Completed`);
      }),
    );
  }

  private sanitizeData(data: unknown): SanitizedData | null {
    if (!data || typeof data !== 'object' || data === null) {
      return null;
    }

    if (Array.isArray(data)) {
      return null;
    }

    const sanitized: SanitizedData = { ...(data as Record<string, any>) };

    this.sensitiveFields.forEach((field: SensitiveField): void => {
      if (field in sanitized && sanitized[field] !== undefined) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}