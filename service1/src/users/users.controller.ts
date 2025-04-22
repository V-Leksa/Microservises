import { Body, Controller, ForbiddenException, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { addUsers } from 'src/shared/userGenerator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserRequest } from './dto/createUser.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('allByDb')
  @ApiOperation({ summary: 'Получение всех пользователей из базы данных' })
  @ApiResponse({ status: 200, description: 'Пользователи успешно получены' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post('new')
  @ApiOperation({ summary: 'Создание нового пользователя' })
  @ApiBody({ type: CreateUserRequest })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async createNew(@Body() body: CreateUserRequest): Promise<User> {

    if (!body.permissions.create) {
      throw new ForbiddenException('Нет прав на создание');
    }

    console.log(body.user);
    console.log(body.permissions);

    return await this.usersService.create(body.user);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно получен' })
  @ApiResponse({ status: 400, description: 'Пользователь не найден' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async getOneById(@Param('id') id: number): Promise<User> {
    return await this.usersService.getOneById(id); 
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  public async updateUser(@Param('id') id: number, @Body() userData: UserDto): Promise<UserDto> {
    return await this.usersService.updateUser(id, userData);
  }

  
  @Post('seed')
  @ApiOperation({ summary: 'Создание тестовых данных' })
  @ApiResponse({ status: 200, description: 'Тестовые данные успешно созданы' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  public async seedUsers(@Body() body: {permissions: Record<string, boolean>}): Promise<void> {
    if (!body.permissions.create) {
      throw new ForbiddenException('Нет прав на создание');
    }
    await addUsers(this.usersService, 10); // Создаст 10 пользователей
  }
}
