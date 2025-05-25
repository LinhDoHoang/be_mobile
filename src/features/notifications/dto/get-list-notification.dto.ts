import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationInputDto } from 'src/common/dto/pagination-input.dto';

export class GetListNotificationDto extends PaginationInputDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  createFrom?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  createTo?: string;
}
