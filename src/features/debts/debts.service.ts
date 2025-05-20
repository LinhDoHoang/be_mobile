import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt } from './entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Injectable()
export class DebtsService {
  private readonly logger = new Logger(DebtsService.name);

  constructor(
    @InjectRepository(Debt)
    private readonly debtRepo: Repository<Debt>,
  ) {}

  async create(dto: CreateDebtDto): Promise<Debt> {
    try {
      const debt = this.debtRepo.create({ ...dto, user: { id: dto?.userId } });
      return await this.debtRepo.save(debt);
    } catch (error) {
      this.logger.error('Debt creation failed', error.stack);
      throw new InternalServerErrorException('Debt creation failed');
    }
  }

  async findAll(): Promise<Debt[]> {
    try {
      return await this.debtRepo.find();
    } catch (error) {
      this.logger.error('Fetching debts failed', error.stack);
      throw new InternalServerErrorException('Fetching debts failed');
    }
  }

  async findOne(id: string): Promise<Debt> {
    try {
      const debt = await this.debtRepo.findOne({
        where: { id },
      });
      if (!debt) throw new NotFoundException('Debt not found');
      return debt;
    } catch (error) {
      this.logger.error(`Fetching debt failed: ID = ${id}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateDebtDto): Promise<Debt> {
    try {
      await this.debtRepo.update(id, dto);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`Updating debt failed: ID = ${id}`, error.stack);
      throw new InternalServerErrorException('Debt update failed');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.debtRepo.delete(id);
      if (result.affected === 0) throw new NotFoundException('Debt not found');
    } catch (error) {
      this.logger.error(`Deleting debt failed: ID = ${id}`, error.stack);
      throw error;
    }
  }
}
