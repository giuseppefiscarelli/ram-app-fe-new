import { EmployeeDescriptorInterface } from './../../../config/network/api.descriptors';



import { Employee } from './../employee.model';



export class EmployeesFactory {
    static create (descriptor: EmployeeDescriptorInterface): Employee {
        const instance: Employee = new Employee();
        const keysToDuplicate = [
            'id',
            'idUser',
            'surname',
            'name',
            'company',
            'enabled',
            'note',
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);

        return instance;
    }
}
