import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationInputDto } from 'src/common/dto/pagination-input.dto';

export class GetListTransactionDto extends PaginationInputDto {
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
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  sort?: string;

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
