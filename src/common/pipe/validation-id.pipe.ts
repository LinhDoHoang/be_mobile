import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidationIDPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!+value)
      throw new BadRequestException({
        isControlled: true,
        message: 'ID must be a number',
        data: null,
      });

    return +value;
  }
}
