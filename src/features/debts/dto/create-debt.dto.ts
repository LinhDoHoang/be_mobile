import {
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { DebtsStatus, DebtsType } from 'src/common/constant';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtDto {
  @ApiProperty({
    example: 'd58b431b-f93b-4e17-9447-caeefde5f3d0',
    description: 'ID người dùng',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'Nợ tiền sách',
    description: 'Tên khoản nợ',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'borrow',
    enum: DebtsType,
    description: 'Loại khoản nợ (vay hoặc cho vay)',
  })
  @IsEnum(DebtsType)
  type: DebtsType;

  @ApiProperty({
    example: 500000,
    description: 'Số tiền nợ',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên người nợ (hoặc người cho vay)',
  })
  @IsString()
  debtorName: string;

  @ApiProperty({
    example: 'Mượn tiền mua sách học',
    description: 'Chi tiết khoản nợ',
  })
  @IsString()
  detail: string;

  @ApiProperty({
    example: '2025-05-01T00:00:00.000Z',
    description: 'Ngày phát sinh khoản nợ (ISO 8601)',
  })
  @IsDateString()
  debtDate: Date;

  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    description: 'Ngày đến hạn trả (ISO 8601)',
  })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({
    example: 'unpaid',
    enum: DebtsStatus,
    description: 'Trạng thái khoản nợ',
  })
  @IsEnum(DebtsStatus)
  status: DebtsStatus;
}
