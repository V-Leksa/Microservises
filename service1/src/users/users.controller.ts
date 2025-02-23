import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { addUsers } from 'src/shared/userGenerator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('allByDb')
  public async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }
  @Post('new')
  public async createNew(@Body() user: User): Promise<User> {
    return await this.usersService.create(user);
  }

  @Get('all')
  public getAll(): UserDto[] {
    return this.usersService.getAll();
  }

  @Get('/:id')
  public async getOneById(@Param('id') id: number): Promise<User> {
    return await this.usersService.getOneById(id); 
  }

  @Post()
  public createUser(@Body() userData: UserDto): UserDto {
    return this.usersService.createUser(userData);
  }

  @Patch(':id')
  public updateUser(@Param('id') id: number, @Body() userData: UserDto): UserDto {
    return this.usersService.updateUser(id, userData);
  }
  @Post('seed')
  public async seedUsers(): Promise<void> {
    await addUsers(this.usersService, 10); // Создаст 10 пользователей
  }
}
