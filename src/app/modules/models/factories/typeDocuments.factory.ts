import { TypeDocumentsDescriptorInterface } from './../../../config/network/api.descriptors';
import { TypeDocument } from './../typeDocument.model';

export class TypeDocumentsFactory {
    static create(descriptor:TypeDocumentsDescriptorInterface ): TypeDocument {
        const instance: TypeDocument = new TypeDocument();
        const keysToDuplicate = [
            'id',
            'description',
            'required',
            'upload',
            'adminControl',
            'adminNote',
            'fields',
            ];
            keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
            return instance;
    }
}
