import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    try {
      const transaction = this.transactionRepo.create({
        ...dto,
        user: { id: dto?.userId },
      });
      return await this.transactionRepo.save(transaction);
    } catch (error) {
      this.logger.error('Create failed', error.stack);
      throw new InternalServerErrorException('Transaction creation failed');
    }
  }

  async findAll(): Promise<Transaction[]> {
    try {
      return await this.transactionRepo.find();
    } catch (error) {
      this.logger.error('Find all failed', error.stack);
      throw new InternalServerErrorException('Failed to retrieve transactions');
    }
  }

  async findOne(id: string): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepo.findOne({
        where: { id },
      });
      if (!transaction) throw new NotFoundException('Transaction not found');
      return transaction;
    } catch (error) {
      this.logger.error(`Find one failed: ID = ${id}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    try {
      await this.transactionRepo.update(id, dto);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`Update failed: ID = ${id}`, error.stack);
      throw new InternalServerErrorException('Update failed');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.transactionRepo.delete(id);
      if (result.affected === 0)
        throw new NotFoundException('Transaction not found');
    } catch (error) {
      this.logger.error(`Delete failed: ID = ${id}`, error.stack);
      throw error;
    }
  }
}
