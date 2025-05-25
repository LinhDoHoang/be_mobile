import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  private readonly loggerService: Logger;
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    this.loggerService = new Logger('UsersService');
  }

  async create(dto: CreateUserDto) {
    try {
      const user = this.userRepo.create(dto);
      const savedUser = await this.userRepo.save(user);
      this.loggerService.debug('User created successfully');
      return plainToInstance(UserResponseDto, savedUser);
    } catch (error) {
      this.loggerService.error('User creation failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findAll() {
    try {
      const users = await this.userRepo.find();
      this.loggerService.debug('All users fetched successfully');
      return plainToInstance(UserResponseDto, users);
    } catch (error) {
      this.loggerService.error('Fetching users failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      this.loggerService.debug(`User fetched successfully`);
      return plainToInstance(UserResponseDto, user);
    } catch (error) {
      this.loggerService.error(`Fetching user failed`, error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      await this.userRepo.update(id, dto);
      const updatedUser = await this.findOne(id);
      this.loggerService.debug(`User updated successfully`);
      return plainToInstance(UserResponseDto, updatedUser);
    } catch (error) {
      this.loggerService.error(`Updating user failed`, error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.userRepo.delete(id);
      this.loggerService.debug(`User deleted successfully`);
    } catch (error) {
      this.loggerService.error(`Deleting user failed`, error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
