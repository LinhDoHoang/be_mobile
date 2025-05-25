import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Catch()
export class GlobalExceptionFilter extends ExceptionsHandler {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception?.response?.isControlled) {
      const { isControlled, ...res } = exception.response;
      response
        .status(exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json(res);
      return;
    }

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errors = exception.getResponse
      ? exception.getResponse()
      : exception.message;

    const message = errors.message ? errors.message : 'System error';

    const data = errors?.driverError?.detail
      ? errors?.driverError?.detail
      : errors.error;

    response.status(status).json({
      message,
      data,
    });
  }
}
