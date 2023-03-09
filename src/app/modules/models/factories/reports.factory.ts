import { ReportDerscriptorInterface } from './../../../config/network/api.descriptors';
import { Report } from './../report.model';

export class ReportsFactory{
    static create(descriptor: ReportDerscriptorInterface): Report{
        const instance: Report = new Report();
        const keysToDuplicate = [
            'id',
            'updatedAt',
            'createdAt',
            'id_ram',
            'prot_ram',
            'userCreate',
            'dataCreate',
            'userConversion',
            'dataConversion',
            'dataSend',
            'userSend',
            'filenameUpload',
            'filenameStorage',
            'fd',
            'status',
            'typeReport',
            'enable',
            'detail'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
        return instance;

    }
}
