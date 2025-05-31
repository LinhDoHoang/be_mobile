import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetListTransactionDto } from './dto/get-list-transaction.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { plainToInstance } from 'class-transformer';
import { TransactionResponseDto } from './dto/response-transaction.dto';
import { TransactionsType } from 'src/common/constant';

const alias = 'transactions';
@Injectable()
export class TransactionsService {
  private readonly loggerService: Logger;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {
    this.loggerService = new Logger('TransactionsService');
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    try {
      const transaction = this.transactionRepo.create({
        ...dto,
        user: { id: dto?.userId },
      });
      const savedTransaction = await this.transactionRepo.save(transaction);
      this.loggerService.debug('Transaction created successfully');
      return savedTransaction;
    } catch (error) {
      this.loggerService.error('Transaction creation failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findAll(query: GetListTransactionDto) {
    const {
      page = 1,
      limit = 10,
      amount,
      detail,
      name,
      type,
      createFrom,
      createTo,
      id,
      userId,
    } = query;

    try {
      const queryBuilder = this.transactionRepo.createQueryBuilder(alias);

      queryBuilder.where('1=1');

      if (amount) {
        queryBuilder.andWhere(`${alias}.amount = :amount`, { amount });
      }
      if (createFrom) {
        queryBuilder.andWhere(`${alias}.date >= :createFrom`, {
          createFrom: new Date(Number(createFrom)),
        });
      }
      if (createTo) {
        queryBuilder.andWhere(`${alias}.date <= :createTo`, {
          createTo: new Date(Number(createTo)),
        });
      }
      if (id) {
        queryBuilder.andWhere(`${alias}.id = :id`, {
          id,
        });
      }
      if (userId) {
        queryBuilder.andWhere(`${alias}.user_id = :userId`, {
          userId,
        });
      }
      if (detail) {
        queryBuilder.andWhere(`${alias}.detail = :detail`, {
          detail,
        });
      }
      if (name) {
        queryBuilder.andWhere(`${alias}.name = :name`, {
          name,
        });
      }
      if (type) {
        queryBuilder.andWhere(`${alias}.type = :type`, {
          type,
        });
      }

      queryBuilder.orderBy(`${alias}.created_at`, 'DESC');

      const result = await paginate<Transaction>(queryBuilder, {
        limit,
        page,
      });

      this.loggerService.debug('Transaction fetched successfully');

      return result;
    } catch (error) {
      this.loggerService.error('Fetching transactions failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findOne(id: number): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepo.findOne({
        where: { id },
        relations: ['user', 'debt'], // Include user relation
      });
      this.loggerService.debug(`Transaction fetched successfully`);
      return transaction;
    } catch (error) {
      this.loggerService.error(`Fetching transaction failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findAllExpenses(query: GetListTransactionDto) {
    const {
      page = 1,
      limit = 10,
      amount,
      detail,
      name,
      type,
      createFrom,
      createTo,
      id,
      userId,
    } = query;
    try {
      const queryBuilder = this.transactionRepo.createQueryBuilder(alias);

      queryBuilder.where('1=1');
      queryBuilder.andWhere(`${alias}.type NOT IN (:...types)`, {
        types: [
          TransactionsType.INCOME,
          TransactionsType.BORROW,
          TransactionsType.LEND,
        ],
      });

      if (amount) {
        queryBuilder.andWhere(`${alias}.amount = :amount`, { amount });
      }
      if (createFrom) {
        queryBuilder.andWhere(`${alias}.date >= :createFrom`, {
          createFrom: new Date(Number(createFrom)),
        });
      }
      if (createTo) {
        queryBuilder.andWhere(`${alias}.date <= :createTo`, {
          createTo: new Date(Number(createTo)),
        });
      }
      if (id) {
        queryBuilder.andWhere(`${alias}.id = :id`, {
          id,
        });
      }
      if (userId) {
        queryBuilder.andWhere(`${alias}.user_id = :userId`, {
          userId,
        });
      }
      if (detail) {
        queryBuilder.andWhere(`${alias}.detail = :detail`, {
          detail,
        });
      }
      if (name) {
        queryBuilder.andWhere(`${alias}.name = :name`, {
          name,
        });
      }
      if (type) {
        queryBuilder.andWhere(`${alias}.type = :type`, {
          type,
        });
      }

      queryBuilder.orderBy(`${alias}.created_at`, 'DESC');

      const result = await paginate<Transaction>(queryBuilder, {
        limit,
        page,
      });

      this.loggerService.debug(`Expenses fetched successfully`);
      return result;
    } catch (error) {
      this.loggerService.error(`Fetching expenses failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async update(id: number, dto: UpdateTransactionDto) {
    try {
      await this.transactionRepo.update(id, dto);
      const updatedTransaction = await this.findOne(id);
      this.loggerService.debug(`Transaction updated successfully`);
      return plainToInstance(TransactionResponseDto, updatedTransaction);
    } catch (error) {
      this.loggerService.error(`Updating transaction failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.transactionRepo.delete(id);
      this.loggerService.debug(`Transaction deleted successfully`);
    } catch (error) {
      this.loggerService.error(`Deleting transaction failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
