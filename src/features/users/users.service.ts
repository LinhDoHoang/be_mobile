import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepo.create(dto);
      return await this.userRepo.save(user);
    } catch (error) {
      this.logger.error('User creation failed', error.stack);
      throw new InternalServerErrorException('User creation failed');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepo.find();
    } catch (error) {
      this.logger.error('Fetching users failed', error.stack);
      throw new InternalServerErrorException('Fetching users failed');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepo.findOne({
        where: { id },
      });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      this.logger.error(`Fetching user failed: ID = ${id}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      await this.userRepo.update(id, dto);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`Updating user failed: ID = ${id}`, error.stack);
      throw new InternalServerErrorException('User update failed');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userRepo.delete(id);
      if (result.affected === 0) throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(`Deleting user failed: ID = ${id}`, error.stack);
      throw error;
    }
  }
}
