import { CompaniesDescriptorInterface } from './../../../config/network/api.descriptors';

import { Company } from '../company.model';

export class CompaniesFactory {
    static create(descriptor: CompaniesDescriptorInterface): Company {
        const instance: Company = new Company();
        const keysToDuplicate = [
            'id','description'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);

        return instance;
    }
}
