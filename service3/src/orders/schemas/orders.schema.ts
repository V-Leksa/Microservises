import { Schema } from "mongoose";

export const OrderSchema = new Schema({
    userId: { type: Number, required: true },
    products: [{
        productId: { type: Number, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 }
    }],
    createdAt: { type: Date, default: Date.now }
});