import { Document } from "mongoose";

export interface ReportsData extends Document {
    title: string,
    reportInfo: string,
    rating: number
}