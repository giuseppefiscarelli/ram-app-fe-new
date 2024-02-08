import { MailConfig } from '../mailConfig.model';
import { MailConfigDescriptorInterface } from './../../../config/network/api.descriptors';


export class MailConfigFactory{
    static create(descriptor: MailConfigDescriptorInterface): MailConfig{
        const instance: MailConfig = new MailConfig();
        const keysToDuplicate = [
            'id',
            'updatedAt',
            'createdAt',
            'user',
            'host',
            'port',
            'password'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
        return instance;

    }
}
