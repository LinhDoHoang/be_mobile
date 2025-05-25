import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TransactionsType } from 'src/common/constant';

export class CreateTransactionDto {
  @ApiProperty({
    example: 1,
    description: "User's ID",
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    example: 'April Salary',
    description: 'Name of transaction',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'income',
    enum: TransactionsType,
    description: 'Loại giao dịch',
  })
  @IsNotEmpty()
  @IsEnum(TransactionsType)
  type: TransactionsType;

  @ApiProperty({
    example: 15000000,
    description: 'Money',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    example: 'A hard working month',
    description: 'Detail for transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({
    example: '2025-05-20T08:00:00.000Z',
    description: 'Time of transaction',
  })
  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
