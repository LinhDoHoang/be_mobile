import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationInputDto {
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
