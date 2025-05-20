import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    example: '4aeb6c3f-d96e-4a8b-8ee7-9bba3c96e3c3',
    description: 'ID của người dùng',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'Lương tháng 5',
    description: 'Tên giao dịch',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'income',
    enum: ['income', 'expense'],
    description: 'Loại giao dịch',
  })
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @ApiProperty({
    example: 15000000,
    description: 'Số tiền giao dịch',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'Lương chuyển khoản từ công ty',
    description: 'Chi tiết giao dịch',
    required: false,
  })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({
    example: '2025-05-20T08:00:00.000Z',
    description: 'Ngày giao dịch (ISO format)',
  })
  @IsDateString()
  date: Date;
}
