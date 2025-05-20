// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Delete,
//   Put,
// } from '@nestjs/common';
// import { TransactionsService } from './transactions.service';
// import { CreateTransactionDto } from './dto/create-transaction.dto';
// import { UpdateTransactionDto } from './dto/update-transaction.dto';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('Transactions')
// @Controller('transactions')
// export class TransactionsController {
//   constructor(private readonly service: TransactionsService) {}

//   @Post()
//   create(@Body() dto: CreateTransactionDto) {
//     return this.service.create(dto);
//   }

//   @Get()
//   findAll() {
//     return this.service.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.service.findOne(id);
//   }

//   @Put(':id')
//   update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
//     return this.service.update(id, dto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.service.remove(id);
//   }
// }
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo giao dịch mới' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Giao dịch được tạo thành công' })
  create(@Body() dto: CreateTransactionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả giao dịch' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một giao dịch' })
  @ApiParam({ name: 'id', example: 'a23b9cde-78f2-4d11-8bcd-5a9e3eab9a9c' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin giao dịch' })
  @ApiParam({ name: 'id', example: 'a23b9cde-78f2-4d11-8bcd-5a9e3eab9a9c' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa giao dịch' })
  @ApiParam({ name: 'id', example: 'a23b9cde-78f2-4d11-8bcd-5a9e3eab9a9c' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
