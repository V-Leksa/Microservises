import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    id: number;

    @Column()
    @ApiProperty({ example: 'username', description: 'Имя пользователя' })
    username: string;

    @Column()
    @ApiProperty({ example: 'email@example.com', description: 'Email пользователя' })
    email: string;

    @Column()
    @ApiProperty({ example: 'qwerty', description: 'Пароль пользователя' })
    password: string;

    @Column()
    @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
    first_name: string;

    @Column()
    @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
    last_name: string;

    @Column()
    @ApiProperty({ example: '+1234567890', description: 'Номер телефона пользователя' })
    phone_number: string;

    @Column()
    @ApiProperty({ example: 'Улица Ленина', description: 'Адрес пользователя' })
    address: string;

    @Column()
    @ApiProperty({ example: 'Москва', description: 'Город пользователя' })
    city: string;

    @Column()
    @ApiProperty({ example: 'Московская область', description: 'Область пользователя' })
    state: string;

    @Column()
    @ApiProperty({ example: '123456', description: 'Почтовый индекс пользователя' })
    zip_code: string;

    @Column()
    @ApiProperty({ example: 'Россия', description: 'Страна пользователя' })
    country: string;

    @Column()
    @ApiProperty({ example: new Date().toISOString(), description: 'Дата создания' })
    created_at: Date;

    @Column()
    @ApiProperty({ example: new Date().toISOString(), description: 'Дата обновления' })
    updated_at: Date;

    @Column()
    @ApiProperty({ example: 'admin', description: 'Роль пользователя' })
    role: string;
}