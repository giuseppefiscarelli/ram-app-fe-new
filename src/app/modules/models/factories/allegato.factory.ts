import { AllegatoDescriptorInterface } from './../../../config/network/api.descriptors';
import { Allegato } from './../allegato.model';

export class AllegatoFactory {
    static create(descriptor: AllegatoDescriptorInterface): Allegato{
        const instance: Allegato = new Allegato();
        const keysToDuplicate = [
            'id',
            'updatedAt',
            'createdAt',
            'id_ram',
            'id_Veicolo',
            'typeVei',
            'typeDocument',
            'filenameUpload',
            'filenameStorage',
            'jsonData',
            'note',
            'enable',
            'userUpload',
            'dataUpload',
            'adminState',
            'adminNote',
            'adminDate',
            'adminUser',
            'fd'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
        return instance;

    }
}
