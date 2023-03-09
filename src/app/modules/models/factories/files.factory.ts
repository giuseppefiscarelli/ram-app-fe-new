import { FileModel } from './../file.model';

import { FileDescriptorInterface } from './../../configs/network/api.descriptors';
export class FilesFactory {
    static create(descriptor: FileDescriptorInterface): FileModel {
        const instance: FileModel = new FileModel();
        const keysToDuplicate = [
            'id',
            'fd',
            'filename',
            'refId',
            'refType',
            'type',
            'typeFile',
            'note'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
        return instance;
    }
}
