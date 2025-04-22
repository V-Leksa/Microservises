import { faker } from '@faker-js/faker';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

export async function addProducts(productsService: ProductsService, count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
        const product: Product = {
            id: undefined, // id будет сгенерирован автоматически
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()), // Генерация цены с преобразованием в число
            stock_quantity: faker.number.int({ min: 0, max: 100 }), // Генерация количества на складе
            category: faker.commerce.department(),
            image_url: faker.image.url(), // Генерация случайного URL изображения
            created_at: new Date(),
            updated_at: new Date(),
        };

        // Сохранение продукта в базу данных
        await productsService.create(product);
    }
}