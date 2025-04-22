import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReportsDto } from './dtos/reports.dto';
import { Cache } from '@nestjs/cache-manager';
import logger from '../logger/reports.logger';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel('Report') private readonly reportModel: Model<Report>,
        private readonly cacheManager: Cache,
    ){}

    public async create(createReportData: CreateReportsDto): Promise<Report> {
        
        logger.info('Creating a new report');

        const createdReport = new this.reportModel(createReportData);
        await createdReport.save(); 
        
        await this.cacheManager.del('all_reports');

        logger.info(`Report created with ID: ${createdReport.id}`);
        
        return createdReport;
    }

    public async findAll(): Promise<Report[]> {
        const reports = await this.reportModel.find().exec();
        return reports;
    }

    public async findOne(id: string): Promise<Report> {
        
        logger.info(`Finding report with ID: ${id}`); 

        const cachedReport = await this.cacheManager.get<Report>(`report_${id}`); 
        if (cachedReport) {
            logger.info(`Returning report ${id} from cache`); 

            console.log(`Получение отчета ${id} из кэша`);
            return cachedReport; 
        }

        const report = await this.reportModel.findById(id).exec();
        if (!report) {
            logger.error(`No report found with ID: ${id}`); 

            throw new BadRequestException('No report found with the provided id');
        }
        
        await this.cacheManager.set(`report_${id}`, report); 

        logger.info(`Fetched report with ID: ${id}`);

        return report;
    }

    public async delete(id: string): Promise<any> {
        
        logger.info(`Deleting report with ID: ${id}`);

        const deletedReport = await this.reportModel.findByIdAndDelete(id).exec();
        
        if (!deletedReport) {
            logger.error(`No report found with ID: ${id} for deletion`); 

            throw new BadRequestException('No report found with the provided id');
        }

        await this.cacheManager.del(`report_${id}`);

        logger.info(`Report deleted with ID: ${id}`); 
        
        return deletedReport;
    }

    public async update(id: string, payload: CreateReportsDto): Promise<Report> {
        
        logger.info(`Updating report with ID: ${id}`);

        const updatedReport = await this.reportModel.findByIdAndUpdate(id, payload, { new: true }).exec();
        
        if (!updatedReport) {
            logger.error(`No report found with ID: ${id} for update`);

            throw new BadRequestException('No report found with the provided id');
        }

        await this.cacheManager.del(`report_${id}`);

        logger.info(`Report updated with ID: ${updatedReport.id}`);
        
        return updatedReport;
    }
}
