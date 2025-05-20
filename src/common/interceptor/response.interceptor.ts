import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const method = request.method;
    const url = request.originalUrl;

    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          message: this.getSuccessMessage(method, url),
          data,
        };
      }),
      catchError((err) => {
        const message =
          err?.response?.message || err.message || 'Unknown error';
        return throwError(() => ({
          success: false,
          message,
          data: null,
          statusCode: err.status || 500,
        }));
      }),
    );
  }

  private getSuccessMessage(method: string, url: string): string {
    switch (method) {
      case 'GET':
        return 'Lấy dữ liệu thành công';
      case 'POST':
        return 'Tạo mới thành công';
      case 'PUT':
      case 'PATCH':
        return 'Cập nhật thành công';
      case 'DELETE':
        return 'Xóa thành công';
      default:
        return 'Thao tác thành công';
    }
  }
}
