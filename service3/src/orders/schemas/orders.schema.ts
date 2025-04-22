import { Schema } from "mongoose";

export const OrderSchema = new Schema({
    userId: { type: Number, required: true },
    products: { type: Array<typeof ProductsArraySchema>, required: true},
    createdAt: { type: Date, default: Date.now }
});

export const ProductsArraySchema = new Schema({
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }
})