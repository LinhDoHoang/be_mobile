import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DueInputDto {
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
  createFrom?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  createTo?: string;
}
