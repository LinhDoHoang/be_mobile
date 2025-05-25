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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';
import { GetListTransactionDto } from './dto/get-list-transaction.dto';
import JwtAuthGuard from 'src/common/guard/jwt-auth.guard';
import { User } from 'src/common/decorator/auth.decorator';

@ApiTags('Transactions')
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  private readonly loggerService: Logger;

  constructor(private readonly service: TransactionsService) {
    this.loggerService = new Logger('TransactionsController');
  }

  @Post()
  @ApiOperation({ summary: 'Create transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Create transaction successfully' })
  async create(@Body() dto: CreateTransactionDto, @User() user) {
    this.loggerService.debug('Start creating transaction');
    const newTransaction = await this.service.create({
      ...dto,
      userId: user.id,
    });
    this.loggerService.debug('Complete creating transaction');
    return newTransaction;
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Get all transactions successfully',
  })
  async findAll(@Query() query: GetListTransactionDto) {
    this.loggerService.debug('Start fetching all transactions');
    const transactions = await this.service.findAll(query);
    this.loggerService.debug('Complete fetching all transactions');
    return transactions;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 200, description: 'Update transaction successfully' })
  async update(
    @Param('id', ValidationIDPipe) id: number,
    @Body() dto: UpdateTransactionDto,
  ) {
    this.loggerService.debug(`Start updating transaction`);
    const updatedTransaction = await this.service.update(id, dto);
    this.loggerService.debug(`Complete updating transaction`);
    return updatedTransaction;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Delete transaction successfully' })
  async remove(@Param('id', ValidationIDPipe) id: number) {
    this.loggerService.debug(`Start deleting transaction`);
    await this.service.remove(id);
    this.loggerService.debug(`Complete deleting transaction`);
    return null;
  }
}
