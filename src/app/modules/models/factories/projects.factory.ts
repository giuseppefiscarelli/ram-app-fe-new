import { ProjectsDescriptorInterface } from '../../../config/network/api.descriptors';
import { Project } from './../project.model';

export class ProjectFactory{
    static create (descriptor: ProjectsDescriptorInterface): Project{
        const instance: Project = new Project();
        const keysToDuplicate = [
          'id',
          'company',
          'type',
          'category',
          'internalCode',
          'description',
          'idCustomer',
          'status',
          'idSupervisor',
          'datePlanStart',
          'datePlanEnd',
          'dateStart',
          'dateEnd',
          'dateDelivery',
          'workingMinutes',
          'intervalMinutes',
          'attachData'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
        return instance;
    }
}
