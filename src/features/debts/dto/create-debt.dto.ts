import {
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { DebtsStatus, TransactionsType } from 'src/common/constant';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDebtDto {
  @ApiProperty({
    example: 1,
    description: "Transaction's ID",
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  transactionId: number;

  @ApiProperty({
    example: 'Johan Chua',
    description: "Debtor's name",
  })
  @IsString()
  debtorName: string;

  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    description: 'Due date',
  })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({
    example: DebtsStatus.PENDING,
    enum: DebtsStatus,
    description: 'Debt status',
  })
  @IsNotEmpty()
  @IsEnum(DebtsStatus)
  status: DebtsStatus;

  @ApiProperty({
    example: 1,
    description: "User's ID",
  })
  @IsOptional()
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
