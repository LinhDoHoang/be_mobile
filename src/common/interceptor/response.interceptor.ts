import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    return next.handle().pipe(
      map((data) => {
        const requestClass = context.getClass().name;
        const message = this.getSuccessMessage(
          method,
          requestClass.toLowerCase().slice(0, -11),
        );

        return {
          message,
          data,
        };
      }),
    );
  }

  private getSuccessMessage(method: string, entity: string = ''): string {
    switch (method) {
      case 'GET':
        return `Successfully retrieved ${entity} data`;
      case 'POST':
        return `Successfully created new ${entity}`;
      case 'PUT':
      case 'PATCH':
        return `Successfully updated ${entity}`;
      case 'DELETE':
        return `Successfully deleted ${entity}`;
      default:
        return `Successfully performed operation`;
    }
  }
}
