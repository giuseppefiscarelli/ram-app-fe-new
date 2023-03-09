import { SubjectsDescriptorInterface } from './../../configs/network/api.descriptors';

import * as Moment from 'moment';
import { Subject } from '../subject.model';


export class SubjectsFactory {
    static create(descriptor: SubjectsDescriptorInterface): Subject {
        const instance: Subject = new Subject();
        const keysToDuplicate = [
            'id',
            'type',
            'category',
            'name',
            'surname',
            'dateOfBirth',
            'countryOfBirth',
            'provinceOfBirth',
            'birthplace',
            'citizenship',
            'gender',
            'fiscalCode',
            'businessName',
            'vatNumber',
            'purchaseDiscountClass',
            'saleDiscountClass',
            'address',
            'zipCode',
            'district',
            'country',
            'city',
            'primaryPhone',
            'secondaryPhone',
            'primaryMobile',
            'secondaryMobile',
            'fax',
            'pec',
            'primaryEmail',
            'secondaryEmail',
            'enabled',
            'note',
            'createdBy',
            'updatedBy',
        ];

        keysToDuplicate.forEach(key => {

                instance[key] = descriptor[key];

        });


        instance.createdAt = Moment.utc(descriptor.createdAt).toISOString();
        instance.updatedAt = Moment.utc(descriptor.updatedAt).toISOString();

        return instance;
    }
}
