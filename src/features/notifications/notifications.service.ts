import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetListNotificationDto } from './dto/get-list-notification.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { NotificationResponseDto } from './dto/response-notification.dto';
import { plainToInstance } from 'class-transformer';

const alias = 'notifications';

@Injectable()
export class NotificationsService {
  private readonly loggerService: Logger;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {
    this.loggerService = new Logger('NotificationsService');
  }

  async create(dto: CreateNotificationDto) {
    try {
      const notification = this.notificationRepo.create({
        ...dto,
        user: { id: dto.userId },
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.loggerService.debug('Notification created successfully');
      return plainToInstance(NotificationResponseDto, savedNotification);
    } catch (error) {
      this.loggerService.error('Notification creation failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findAll(query: GetListNotificationDto, userId: number) {
    const { page = 1, limit = 10, content, createFrom, createTo, id } = query;

    try {
      const queryBuilder = this.notificationRepo.createQueryBuilder(alias);

      queryBuilder.where('1=1');
      queryBuilder.andWhere(`${alias}.user_id = :userId`, {
        userId,
      });

      if (content) {
        queryBuilder.andWhere(`${alias}.content = :content`, { content });
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
      if (id) {
        queryBuilder.andWhere(`${alias}.id = :id`, {
          id,
        });
      }
      if (userId) {
        queryBuilder.andWhere(`${alias}.Id = :userId`, {
          userId,
        });
      }

      queryBuilder.orderBy(`${alias}.created_at`, 'DESC');

      const result = await paginate<Notification>(queryBuilder, {
        limit,
        page,
      });

      this.loggerService.debug(`Notification fetched successfully`);

      return result;
    } catch (error) {
      this.loggerService.error('Fetching notifications failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findOne(id: number): Promise<Notification> {
    try {
      const notification = await this.notificationRepo.findOne({
        where: { id },
        relations: ['user'], // Include user relation if needed
      });
      this.loggerService.debug(`Notification fetched successfully`);
      return notification;
    } catch (error) {
      this.loggerService.error(`Fetching notification failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async update(id: number, dto: UpdateNotificationDto) {
    try {
      await this.notificationRepo.update(id, dto);
      const updatedNotification = await this.findOne(id);
      this.loggerService.debug(`Notification updated successfully`);
      return plainToInstance(NotificationResponseDto, updatedNotification);
    } catch (error) {
      this.loggerService.error(`Updating notification failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.notificationRepo.delete(id);
      this.loggerService.debug(`Notification deleted successfully`);
    } catch (error) {
      this.loggerService.error(`Deleting notification failed`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
