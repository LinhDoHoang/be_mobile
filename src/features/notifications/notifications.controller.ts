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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';
import { GetListNotificationDto } from './dto/get-list-notification.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import JwtAuthGuard from 'src/common/guard/jwt-auth.guard';
import { User } from 'src/common/decorator/auth.decorator';

@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  private readonly loggerService: Logger;

  constructor(private readonly service: NotificationsService) {
    this.loggerService = new Logger('NotificationsController');
  }

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({ status: 201, description: 'Create notification successfully' })
  async create(@Body() dto: CreateNotificationDto, @User() user) {
    this.loggerService.debug('Start creating notification');
    const newNotification = await this.service.create({
      ...dto,
      userId: user.id,
    });
    this.loggerService.debug('Complete creating notification');
    return newNotification;
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Get all notifications successfully',
  })
  async findAll(@Query() query: GetListNotificationDto) {
    this.loggerService.debug('Start fetching all notifications');
    const notifications = await this.service.findAll(query);
    this.loggerService.debug('Complete fetching all notifications');
    return notifications;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({ status: 200, description: 'Update notification successfully' })
  async update(
    @Param('id', ValidationIDPipe) id: number,
    @Body() dto: UpdateNotificationDto,
  ) {
    this.loggerService.debug(`Start updating notification`);
    const updatedNotification = await this.service.update(id, dto);
    this.loggerService.debug(`Complete updating notification`);
    return updatedNotification;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Delete notification successfully' })
  async remove(@Param('id', ValidationIDPipe) id: number) {
    this.loggerService.debug(`Start deleting notification`);
    await this.service.remove(id);
    this.loggerService.debug(`Complete deleting notification`);
    return null;
  }
}
