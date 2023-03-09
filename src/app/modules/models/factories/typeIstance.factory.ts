import { TypeIstanceDescriptorInterface } from './../../../config/network/api.descriptors';

import { TypeIstance } from './../type-istance.model';
export class TypeIstanceFactory {
    static create(descriptor: TypeIstanceDescriptorInterface): TypeIstance{
        const istance: TypeIstance = new TypeIstance();
        const keysToDuplicate = [
            'id',
            'year',
            'description',
            'reportingEndDate',
            'reportingStartDate',
            'sendEndDate',
            'sendStartDate',
            'typeVei',
            'categoryVei',
            'certAttach'
        ];
        keysToDuplicate.forEach(key => istance[key] = descriptor[key]);
        return istance;

    }
}
