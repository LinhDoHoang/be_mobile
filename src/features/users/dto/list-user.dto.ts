import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationInputDto } from 'src/common/dto/pagination-input.dto';

export class GetListUserDto extends PaginationInputDto {
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
  @IsString()
  firstName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  target?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

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
