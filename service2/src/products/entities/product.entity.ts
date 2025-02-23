import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    price: number;
    @Column()
    stock_quantity: number;
    @Column()
    category: string;
    @Column()
    image_url: string;
    @Column()
    created_at: Date;
    @Column()
    updated_at: Date;
}