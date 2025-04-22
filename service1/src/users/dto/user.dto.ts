import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ example: 'Имя пользователя', description: 'Имя пользователя' })
    first_name: string;
    @ApiProperty({ example: 'Фамилия пользователя', description: 'Фамилия пользователя' })
    last_name: string;
    @ApiProperty({ example: 'qwerty', description: 'Пароль пользователя' })
    password: string;
}