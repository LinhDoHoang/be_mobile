import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Logger,
  Query,
  UseGuards,
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
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';
import { DebtsStatus } from 'src/common/constant';
import { GetListDebtDto } from './dto/get-list-debt.dto';
import JwtAuthGuard from 'src/common/guard/jwt-auth.guard';
import { User } from 'src/common/decorator/auth.decorator';

@ApiTags('Debts')
@UseGuards(JwtAuthGuard)
@Controller('debts')
export class DebtsController {
  private readonly loggerService: Logger;

  constructor(private readonly service: DebtsService) {
    this.loggerService = new Logger('DebtsController');
  }

  @Post()
  @ApiOperation({ summary: 'Create debt' })
  @ApiBody({ type: CreateDebtDto })
  @ApiResponse({ status: 201, description: 'Create debt successfully' })
  async create(@Body() dto: CreateDebtDto, @User() user) {
    const {
      status = DebtsStatus.PENDING,
      dueDate,
      debtorName,
      transactionId,
      ...createTransactionDto
    } = dto;

    this.loggerService.debug('Start creating debt');
    const newDebt = await this.service.create(
      { status, dueDate, debtorName, transactionId },
      { ...createTransactionDto, userId: user.id },
    );
    this.loggerService.debug('Complete creating debt');
    return newDebt;
  }

  @Get()
  @ApiOperation({ summary: 'Get all debts' })
  @ApiResponse({ status: 200, description: 'Get all debts successfully' })
  async findAll(@Query() query: GetListDebtDto) {
    this.loggerService.debug('Start fetching all debts');
    const debts = await this.service.findAll(query);
    this.loggerService.debug('Complete fetching all debts');
    return debts;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update debt' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateDebtDto })
  @ApiResponse({ status: 200, description: 'Update debt successfully' })
  async update(
    @Param('id', ValidationIDPipe) id: number,
    @Body() dto: UpdateDebtDto,
  ) {
    this.loggerService.debug(`Start updating debt`);
    const updatedDebt = await this.service.update(id, dto);
    this.loggerService.debug(`Complete updating debt`);
    return updatedDebt;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete debt' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Delete debt successfully' })
  async remove(@Param('id', ValidationIDPipe) id: number) {
    this.loggerService.debug(`Start deleting debt`);
    await this.service.remove(id);
    this.loggerService.debug(`Complete deleting debt`);
    return null;
  }
}
