import { Desk } from './../desk';
import { DesksDescriptorInterface } from './../../../config/network/api.descriptors';



export class DesksFactory {
  static create(descriptor: DesksDescriptorInterface): Desk{
    const instance: Desk = new Desk();
    const keysToDuplicate = [

        'id',
        'idUser',
        'name',
        'code',
        'phase',
        'nameEng',

    ];
    keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
    return instance;

  }
}
