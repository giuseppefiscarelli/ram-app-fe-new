import { StorageKeys } from '@app/app.costants';
import { StorageService } from '@app/modules/services/storage.service';
import { User } from '@app/modules/models/user.model';
import * as Moment from 'moment';


import {UserDescriptorInterface} from '@configs/network/api.descriptors';

export class UsersFactory {
    static create(descriptor: UserDescriptorInterface): User {
        const instance: User = new User();
        const keysToDuplicate = [
            'id',
            'email',
            'role',
            'businessName',
            'vatNumber',
            'note',

        ];

        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);

        instance.createdAt = Moment.utc(descriptor.createdAt).toISOString();


        return instance;
    }

    static restore(): User {
        const storage: StorageService = new StorageService();

        if (!storage.get(StorageKeys.AUTH_LOGGED_USER)) {
            return null;
        }

        const source = storage.get(StorageKeys.AUTH_LOGGED_USER);
        const instance = new User();

        Object
            .keys(source)
            .forEach((key: string) => instance[key] = source[key]);



        return instance;
    }
}
