import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'ID товара' })
    id: number;

    @Column()
    @ApiProperty({ example: 'Название товара', description: 'Название товара' })
    name: string;

    @Column()
    @ApiProperty({ example: 'Описание товара', description: 'Описание товара' })
    description: string;

    @Column()
    @ApiProperty({ example: 100.0, description: 'Цена товара' })
    price: number;

    @Column()
    @ApiProperty({ example: 10, description: 'Количество товара на складе' })
    stock_quantity: number;

    @Column()
    @ApiProperty({ example: 'Категория товара', description: 'Категория товара' })
    category: string;
    
    @Column()
    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL изображения товара' })
    image_url: string;

    @Column()
    @ApiProperty({ example: new Date().toISOString(), description: 'Дата создания' })
    created_at: Date;

    @Column()
    @ApiProperty({ example: new Date().toISOString(), description: 'Дата обновления' })
    updated_at: Date;
}