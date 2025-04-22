import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Cache } from '@nestjs/cache-manager';
import logger from '../logger/users.logger';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly cacheManager: Cache,
    ) { }
    
    public async findAll(): Promise<User[]> {
        
        logger.info('Fetching all users');
        const cachedUsers = await this.cacheManager.get<User[]>('all_users');
        if(cachedUsers){
            logger.info('Returning users from cache'); 
            console.log('Получение данных из кэша');
            return cachedUsers; //возвращение данных их кэша
        }
        const users = await this.userRepository.find();
        await this.cacheManager.set('all_users', users);//сохранение данных в кэш
        logger.info(`Fetched ${users.length} users`);
        return users;

    }
    public async create(data: User): Promise<User> {
        
        logger.info('Creating a new user');

        const user: User = this.userRepository.create(data);
        const savedUser = await this.userRepository.save(user);
        
        logger.info(`User created with ID: ${savedUser.id}`); 
        return savedUser;
    }

    
    public async getOneById(id: number): Promise<User>{
        logger.info(`Fetching user with ID: ${id}`);

        const cachedUser = await this.cacheManager.get<User>(`user_${id}`);
        if(cachedUser){

            logger.info(`Returning user ${id} from cache`);

            console.log(`Получение пользоателя ${id} из кэша`);
            return cachedUser;
        }

        const user = await this.userRepository.findOne({where: {id}});
        if(!user){
            logger.error(`No user found with ID: ${id}`);

            throw new BadRequestException('No user found with the provided id');
        }
        await this.cacheManager.set(`user_${id}`, user);

        logger.info(`Fetched user with ID: ${id}`); 

        return user;
    }
    
    
    public async updateUser(id: number, userData: UserDto): Promise<UserDto> {
        logger.info(`Updating user with ID: ${id}`);

        // Получение пользователя из БД
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            logger.error(`User ${id} not found in database`);
            throw new BadRequestException('User not found');
        }

        //  Обновление поля 
        const updatedUser = Object.assign(user, {
            name: userData.first_name,
            lastname: userData.last_name,
            password: userData.password 
        });

        //  Сохранение в БД
        await this.userRepository.save(updatedUser);

       
        await this.cacheManager.del(`user_${id}`);
        await this.cacheManager.del('all_users');

        const responseDto: UserDto = {
            first_name: updatedUser.name,
            last_name: updatedUser.lastname,
            password: updatedUser.password
        };

        logger.info(`Successfully updated user ${id}`);
        return responseDto;
    }
    
    public async getUserRoleById(userId: number): Promise<string> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found'); 
        }
        return user.role; 
    }

    public async delete(id: number): Promise<void> {
        logger.info(`Deleting user with ID: ${id}`);

        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            logger.error(`No user found with ID: ${id} for deletion`);

            throw new BadRequestException('No user found with the provided id');
        }

        logger.info(`User deleted with ID: ${id}`);
        
        // Удаление пользователя из кэша
        await this.cacheManager.del(`user_${id}`);
    }
}
