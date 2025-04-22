import { Document } from "mongoose";

export interface Order extends Document {
    readonly userId: number;
    readonly products: ProductsArray[],
    readonly createdAt: Date; 
}

export interface ProductsArray extends Document {
    productId: number;
    quantity: number;
    price: number;
    discount: number;
}