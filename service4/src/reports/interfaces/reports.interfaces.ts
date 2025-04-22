import { Document } from "mongoose";
import { ReportsData } from "./reportData.interfaces";

export interface Reports extends Document {
    readonly userId: number;
    readonly goodId: number;
    
    readonly report: ReportsData
}