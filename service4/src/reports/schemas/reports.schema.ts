import { Schema } from "mongoose";

export const ReportsSchema = new Schema({
    userId: { type: Number, required: true },
    goodId: {type: Number, required: true},
    report: {
        title: { type: String, required: true },
        reportInfo: { type: String, required: true },
        rating: { type: Number, required: true }
   },
    
});