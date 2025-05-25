import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationInputDto } from 'src/common/dto/pagination-input.dto';

export class GetListDebtDto extends PaginationInputDto {
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
  transactionId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  debtorName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  dueFrom?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  dueTo?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

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

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  sort?: string;
}
