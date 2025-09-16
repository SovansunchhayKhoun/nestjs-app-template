import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { AppLogger } from '../services/app-logger.service';
import { QueryFailedError } from 'typeorm';
import { TDriverError } from '../types/typeorm/driver-error';

class ErrorResponse {
  message: string;
  validationMessages: Array<string>;
  statusCode: number;
  timestamp: Date;
  errorType: string;
  path: string;
}

function errorFactory(exception: Error, path: string) {
  const errorResponse = new ErrorResponse();

  errorResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  errorResponse.timestamp = new Date(Date.now());
  errorResponse.path = path;
  errorResponse.message = String(exception);
  errorResponse.errorType = exception['code'];
  errorResponse.validationMessages = [];

  if (exception instanceof QueryFailedError) {
    const driverError = exception.driverError as TDriverError;

    if (driverError.code === '23505') {
      errorResponse.statusCode = HttpStatus.CONFLICT;
      errorResponse.errorType = ConflictException.name;
      errorResponse.message = driverError.detail;
    }

    return errorResponse;
  }

  if (exception instanceof HttpException) {
    const response = exception['response'];

    errorResponse.statusCode = exception.getStatus();
    errorResponse.message = exception['message'];
    errorResponse.errorType = exception.name ?? response['error'];
    errorResponse.validationMessages = Array.isArray(response['message'])
      ? response['message']
      : [];
  }

  return errorResponse;
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly appLogger: AppLogger,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const requestQuery = request.query;

    const errorResponse = errorFactory(
      exception,
      httpAdapter.getRequestUrl(request) as string,
    );

    this.appLogger.error(JSON.stringify(errorResponse), null, {
      isShowLog: false,
    });

    httpAdapter.reply(
      ctx.getResponse(),
      requestQuery.page && (requestQuery as any)?.page <= 0
        ? { ...errorResponse, data: [] }
        : errorResponse,
      errorResponse.statusCode,
    );
  }
}
