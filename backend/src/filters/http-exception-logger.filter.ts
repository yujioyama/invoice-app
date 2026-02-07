import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionLoggerFilter implements ExceptionFilter {
  private readonly logger = new Logger("HttpException");

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : (exceptionResponse as any).message;

    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - ${JSON.stringify(message)}`,
    );

    response
      .status(status)
      .json(
        typeof exceptionResponse === "string"
          ? { statusCode: status, message: exceptionResponse }
          : exceptionResponse,
      );
  }
}
