import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { Cache } from '@nestjs/cache-manager';
import logger from '../logger/products.logger';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly cacheManager: Cache,
    ) {}
    public async findAll(): Promise<Product[]> {
                logger.info('Fetching all products'); // Логирование запроса на получение всех продуктов

        const cachedProducts = await this.cacheManager.get<Product[]>('all_products');
        if (cachedProducts) {
            logger.info('Returning products from cache'); 

            console.log('Получение данных из кэша');
            return cachedProducts;
        }

        const products = await this.productRepository.find();
        await this.cacheManager.set('all_products', products);

        logger.info(`Fetched ${products.length} products`); 

        return products;

    }
    public async create(data: Product): Promise<Product> {
        
        logger.info('Creating a new product'); // Логирование создание продукта
        
        const product: Product = this.productRepository.create(data);
        const savedProduct = await this.productRepository.save(product);
        
        logger.info(`Product created with ID: ${savedProduct.id}`); 

        return savedProduct;
    }

    public async getOneById(id: number): Promise<ProductDto> {
        
        logger.info(`Fetching product with ID: ${id}`); 
        
        const cachedProduct = await this.cacheManager.get<Product>(`product_${id}`);
        if (cachedProduct) {
            logger.info(`Returning product ${id} from cache`); 

            return cachedProduct;
        }

        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            logger.error(`No product found with ID: ${id}`); 

            throw new BadRequestException('No product found with the provided id');
        }

        await this.cacheManager.set(`product_${id}`, product);
        
        logger.info(`Fetched product with ID: ${id}`); 

        return product;
    }

    public async updateProduct(id: number, productData: Product): Promise<Product> {
        logger.info(`Updating product with ID: ${id}`); 
        
        const existingProduct = await this.productRepository.findOne({ where: { id } });
        if (!existingProduct) {
            logger.error(`No product found with ID: ${id} for update`); 

            throw new BadRequestException('No product found with the provided id');
        }
        
        const updatedProduct = Object.assign(existingProduct, productData);
        
        await this.cacheManager.del(`product_${id}`); 
        
        const savedProduct = await this.productRepository.save(updatedProduct);
        
        logger.info(`Product updated with ID: ${savedProduct.id}`); 
        return savedProduct;
    }
    public async partialUpdateProduct(id: number, productData: Partial<Product>): Promise<Product> {
        logger.info(`Partially updating product with ID: ${id}`); 
        
        const existingProduct = await this.productRepository.findOne({ where: { id } });
        if (!existingProduct) {
            logger.error(`No product found with ID: ${id} for partial update`); 
            throw new BadRequestException('No product found with the provided id');
        }
        
        const updatedProduct = Object.assign(existingProduct, productData);
        
        await this.cacheManager.del(`product_${id}`); 
        
        const savedProduct = await this.productRepository.save(updatedProduct);
        
        logger.info(`Product partially updated with ID: ${savedProduct.id}`); 
        return savedProduct;
    }

    public async searchByKeyword(query: string): Promise<Product[]> {
        console.log(`Searching for products with query: "${query}"`);
    
        try {
            const products = await this.productRepository
                .createQueryBuilder('product') 
                .where('product.name LIKE :query', { query: `%${query}%` }) // любое кол-во символов до и после искомого слова в имени
                .orWhere('product.description LIKE :query', { query: `%${query}%` }) // поиск в описании
                .getMany(); // выполнение запроса, возврат массива объектов
    
            console.log(`Found ${products.length} products matching the query "${query}".`);
            return products;
        } catch (error) {
            console.error(`Error occurred while searching for products with query "${query}": ${error.message}`);
            throw error; 
        }
    }
    
}

