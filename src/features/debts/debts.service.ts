import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Debt } from './entities/debt.entity';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { Transaction } from '../transactions/entities/transaction.entity';
import { GetListDebtDto } from './dto/get-list-debt.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { UpdateTransactionDto } from '../transactions/dto/update-transaction.dto';

const alias = 'debts';
const transactionAlias = 'transactions';
@Injectable()
export class DebtsService {
  private readonly loggerService: Logger;

  constructor(
    @InjectRepository(Debt)
    private readonly debtRepo: Repository<Debt>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {
    this.loggerService = new Logger('DebtsService');
  }

  async create(dto, createTransactionDto: CreateTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newTransaction = this.transactionRepo.create({
        ...createTransactionDto,
        user: { id: createTransactionDto.userId },
      });
      const saveTransaction = await queryRunner.manager.save(newTransaction);

      const debt = this.debtRepo.create({
        ...dto,
        transaction: { id: saveTransaction.id },
      });
      const savedDebt = await queryRunner.manager.save(debt);

      await queryRunner.commitTransaction();
      this.loggerService.debug('Debt created successfully');
      return savedDebt;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.loggerService.error('Debt creation failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: GetListDebtDto, userId: number) {
    const {
      page = 1,
      limit = 10,
      debtorName,
      dueFrom,
      dueTo,
      status,
      transactionId,
      createFrom,
      createTo,
      id,
    } = query;

    try {
      const queryBuilder = this.debtRepo
        .createQueryBuilder(alias)
        .innerJoinAndSelect(`${alias}.transaction`, transactionAlias)
        .andWhere(`${transactionAlias}.user_id = :userId`, { userId });
      if (debtorName) {
        queryBuilder.andWhere(`${alias}.debtor_name = :debtorName`, {
          debtorName,
        });
      }
      if (createFrom) {
        queryBuilder.andWhere(`${alias}.created_at >= :createFrom`, {
          createFrom: new Date(Number(createFrom)),
        });
      }
      if (createTo) {
        queryBuilder.andWhere(`${alias}.created_at <= :createTo`, {
          createTo: new Date(Number(createTo)),
        });
      }
      if (dueFrom) {
        queryBuilder.andWhere(`${alias}.due_date >= :dueFrom`, {
          dueFrom: new Date(Number(dueFrom)),
        });
      }
      if (dueTo) {
        queryBuilder.andWhere(`${alias}.due_date <= :dueTo`, {
          dueTo: new Date(Number(dueTo)),
        });
      }
      if (id) {
        queryBuilder.andWhere(`${alias}.id = :id`, {
          id,
        });
      }
      if (transactionId) {
        queryBuilder.andWhere(`${alias}.transaction_id = :transactionId`, {
          transactionId,
        });
      }
      if (status) {
        queryBuilder.andWhere(`${alias}.status = :status`, {
          status,
        });
      }

      queryBuilder.orderBy(`${alias}.created_at`, 'DESC');

      const result = await paginate<Debt>(queryBuilder, {
        limit,
        page,
      });

      this.loggerService.debug(`Debts fetched successfully`);

      return result;
    } catch (error) {
      this.loggerService.error('Fetching debts failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findOne(id: number): Promise<Debt> {
    try {
      const debt = await this.debtRepo.findOne({
        where: { id },
        relations: ['transaction'], // Include user relation
      });
      this.loggerService.debug(`Debt fetched successfully`);
      return debt;
    } catch (error) {
      this.loggerService.error(`Fetching debt failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async update(id: number, dto: UpdateDebtDto): Promise<Debt> {
    try {
      const {
        userId,
        name,
        type,
        amount,
        detail,
        date,
        status,
        dueDate,
        debtorName,
        transactionId,
      } = dto;

      const updateTransactionDto: UpdateTransactionDto = {
        ...(userId && { userId }),
        ...(name && { name }),
        ...(type && { type }),
        ...(amount && { amount }),
        ...(detail && { detail }),
        ...(date && { date: new Date(date) }),
      };

      const updateDebtDto = {
        ...(status && { status}),
        ...(dueDate && { dueDate: new Date(dueDate)}),
        ...(debtorName && { debtorName }),
      }

      if (Object.keys(updateTransactionDto).length > 0) {
        const transaction = this.transactionRepo.findOne({ where: { debt: { id }}})

        if (!transaction) throw new BadRequestException({
          message: 'No transaction exist',
          data: null
        })
        await this.transactionRepo.update((await transaction).id, updateTransactionDto);
      }

      if (Object.keys(updateDebtDto).length > 0) await this.debtRepo.update(id, updateDebtDto)
      const updatedDebt = await this.findOne(id);
      this.loggerService.debug(`Debt updated successfully`);
      return updatedDebt;
    } catch (error) {
      this.loggerService.error(`Updating debt failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.debtRepo.delete(id);
      this.loggerService.debug(`Debt deleted successfully`);
      return null;
    } catch (error) {
      this.loggerService.error(`Deleting debt failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
