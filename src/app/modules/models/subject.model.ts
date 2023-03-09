

export enum SubjectType {
    customer = 'customer',
    supplier = 'supplier',
}

export enum SubjectGender {
    male = 'male',
    female = 'female'
}

export class Subject {
    id: string;
    type: [
        {
            id: number;
            name: SubjectType;
        }
    ];
    category: string;
    name: string;
    surname: string;
    fullname: string;
    dateOfBirth: number;
    countryOfBirth: string;
    provinceOfBirth: string;
    birthplace: string;
    citizenship: string;
    gender: SubjectGender;
    fiscalCode: string;
    businessName: string;
    vatNumber: string;
    address: string;
    zipCode: string;
    district: string;
    country: string;
    city: string;
    primaryPhone: string;
    secondaryPhone: string;
    primaryMobile: string;
    secondaryMobile: string;
    fax: string;
    pec: string;
    primaryEmail: string;
    secondaryEmail: string;
    enabled: boolean;
    note: string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;

    constructor() {

    }

    defineExtraProperties(): void {
        this.fullname = `${this.name} ${this.surname}`;
    }
}

// export class Subject {
//     id: string;
//     type: [
//         {
//             id: number;
//             name: SubjectType;
//         }
//     ];
//     code: string;
//     businessName: string;
//     purchaseDiscountClass: DiscountClass;
//     saleDiscountClass: DiscountClass;
//     address: string;
//     zipCode: string;
//     district: string;
//     city: string;
//     country: string;
//     vatNumber: string;
//     fiscalCode: string;
//     enabled: boolean;
//     phone: {
//         prefix: string;
//         number: string;
//         formatted: string;
//     };
//     note: string;
//     createdAt: string;
//     updatedAt: string;
// }
