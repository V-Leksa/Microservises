import { User } from 'src/users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { UsersService } from 'src/users/users.service';
import { random } from 'lodash';

const roles = ['admin', 'manager', 'operator'];

export async function addUsers(usersService: UsersService, count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
        const user: User = {
            id: undefined, // id будет сгенерирован автоматически
            username: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            phone_number: faker.phone.number(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zip_code: faker.location.zipCode(),
            country: faker.location.country(),
            created_at: new Date(),
            updated_at: new Date(),
            role: roles[random(0, roles.length - 1)],
        };

        // Сохраняем пользователя в базу данных
        await usersService.create(user);
    }
}