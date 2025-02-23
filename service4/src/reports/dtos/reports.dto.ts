import { Max, Min } from "class-validator";

export class CreateReportsDto {
    readonly userId: number;
    readonly goodId: number;
    
    readonly report: {
        title: string,
        reportInfo: string,
        rating: ReportDto
    }
}

class ReportDto {
    @Min(1)
    @Max(5)
    readonly rating: number
}