import { TasksDescriptorInterface } from './../../../config/network/api.descriptors';
import { Task } from './../task.model';
export class TasksFactory {
    static create(descriptor: TasksDescriptorInterface ): Task {
        const instance: Task = new Task();

        const keystoDuplicate = [
          'id',
          'idProject',
          'description',
          'datePlanStart',
          'datePlanEnd',
          'dateStart',
          'dateEnd',
          'option',
          'typeOperations',
          'status',
          'quantity',
          'operators',
          'idDesk',
          'checkList',
          'interval',
          'workingDeskMinutes',
          'workingOperatorsMinutes',
          'note'
        ];

        keystoDuplicate.forEach(key => {
                instance[key] = descriptor[key];
        });
        return instance;
    }
}
