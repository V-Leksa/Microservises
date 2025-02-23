import { Document } from "mongoose";

export interface Order extends Document {
    readonly id: number;
    readonly userId: number;
    readonly productsIds: []
}