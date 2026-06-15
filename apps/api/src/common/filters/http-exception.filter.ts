import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponseBody {
  success: false;
  error: {
    code: string;
    message: string | string[];
    statusCode: number;
    path: string;
    timestamp: string;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.resolveMessage(exception);
    const code = this.resolveCode(statusCode);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} failed`,
        exception instanceof Error ? exception.stack : String(exception)
      );
    }

    const body: ErrorResponseBody = {
      success: false,
      error: {
        code,
        message,
        statusCode,
        path: request.url,
        timestamp: new Date().toISOString()
      }
    };

    response.status(statusCode).json(body);
  }

  private resolveMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return response;
      }

      if (this.isRecord(response)) {
        const message = response.message;
        if (typeof message === 'string' || Array.isArray(message)) {
          return message;
        }
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private resolveCode(statusCode: number): string {
    return statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
      ? 'INTERNAL_SERVER_ERROR'
      : 'REQUEST_ERROR';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
