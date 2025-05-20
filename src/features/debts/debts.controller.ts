import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Debts')
@Controller('debts')
export class DebtsController {
  constructor(private readonly service: DebtsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo khoản nợ mới' })
  @ApiBody({ type: CreateDebtDto })
  @ApiResponse({ status: 201, description: 'Tạo khoản nợ thành công' })
  create(@Body() dto: CreateDebtDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả khoản nợ' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết khoản nợ theo ID' })
  @ApiParam({ name: 'id', example: 'c60108b6-938f-456a-bbf3-998abc51aa91' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật khoản nợ' })
  @ApiParam({ name: 'id', example: 'c60108b6-938f-456a-bbf3-998abc51aa91' })
  @ApiBody({ type: UpdateDebtDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  update(@Param('id') id: string, @Body() dto: UpdateDebtDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa khoản nợ' })
  @ApiParam({ name: 'id', example: 'c60108b6-938f-456a-bbf3-998abc51aa91' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
