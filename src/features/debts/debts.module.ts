import { Module } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';

@Module({
  controllers: [DebtsController],
  providers: [DebtsService],
  imports: [TypeOrmModule.forFeature([Debt])],
})
export class DebtsModule {}
