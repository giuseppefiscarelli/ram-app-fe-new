import { VeicoloDescriptorInterface } from './../../../config/network/api.descriptors';
import { Veicolo } from './../veicolo.model';
export class VeicoloFactory {
    static create(descriptor: VeicoloDescriptorInterface): Veicolo{
        const instance: Veicolo = new Veicolo();
        const keysToDuplicate = [
            'id',
            'createdAt',
            'updatedAt',
            'userIns',
            'acquisitionType',
            'amount',
            'brand',
            'category',
            'id_ram',
            'licensePlate',
            'model',
            'type',
            'adminState',
            'adminUser',
            'adminDateUpdate',
            'adminNote',
            'costoIstr',
            'valoreContributo',
            'pmiIstr',
            'reteIstr',
            'noteIstr'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
        return instance;

    }
}
