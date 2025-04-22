import { ApiProperty } from "@nestjs/swagger";

export class ProductDto {
    @ApiProperty({example: 1, description: 'ID товара'})
    id: number;
    @ApiProperty({ example: 'Название товара', description: 'Название товара' })
    name: string;
    @ApiProperty({ example: 'Описание товара', description: 'Описание товара' })
    description: string;
    @ApiProperty({ example: 100.0, description: 'Цена товара' })
    price: number;
    @ApiProperty({ example: 10, description: 'Количество товара на складе' })
    stock_quantity: number;
    @ApiProperty({ example: 'Категория товара', description: 'Категория товара' })
    category: string;
    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL изображения товара' })
    image_url: string;
    @ApiProperty({ example: new Date().toISOString(), description: 'Дата создания' })
    created_at: Date;
    @ApiProperty({ example: new Date().toISOString(), description: 'Дата обновления' })
    updated_at: Date;
}