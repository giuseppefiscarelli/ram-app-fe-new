import { TypesReportDescriptorInterface } from './../../../config/network/api.descriptors';

import { TypeReport } from './../typeReport.model';

export class TypeReportsFactory{
    static create(descriptor: TypesReportDescriptorInterface): TypeReport{
        const instance: TypeReport = new TypeReport();
        const keysToDuplicate = [
            'id',
            'updatedAt',
            'createdAt',
            'description',
            'enable',
            'content',
            'detail',
            'typeistance',
            'type'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
        return instance;

    }
}
