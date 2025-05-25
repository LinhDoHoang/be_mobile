import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';
import JwtAuthGuard from 'src/common/guard/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly loggerService: Logger;

  constructor(private readonly service: UsersService) {
    this.loggerService = new Logger('UsersController');
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Create user successfully' })
  async create(@Body() dto: CreateUserDto) {
    this.loggerService.debug('Start creating user');
    const newUser = await this.service.create(dto);
    this.loggerService.debug('Complete creating user');
    return newUser;
  }

  @Get()
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, description: 'Get user successfully' })
  async findAll() {
    this.loggerService.debug('Start fetching all users');
    const users = await this.service.findAll();
    this.loggerService.debug('Complete fetching all users');
    return users;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Get user successfully' })
  async findOne(@Param('id', ValidationIDPipe) id: number) {
    this.loggerService.debug(`Start getting user`);
    const user = await this.service.findOne(id);
    this.loggerService.debug(`Complete getting user`);
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Update user successfully' })
  async update(
    @Param('id', ValidationIDPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    this.loggerService.debug(`Start updating user`);
    const updatedUser = await this.service.update(id, dto);
    this.loggerService.debug(`Complete updating user`);
    return updatedUser;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Delete user successfully' })
  async remove(@Param('id', ValidationIDPipe) id: number) {
    this.loggerService.debug(`Start deleting user`);
    await this.service.remove(id);
    this.loggerService.debug(`Complete deleting user`);
    return null;
  }
}
