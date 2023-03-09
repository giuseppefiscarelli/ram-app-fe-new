
import {UserDescriptorInterface} from '@configs/network/api.descriptors';
import { StorageKeys } from '../../../app.costants';
import { User } from '../user.model';
import { StorageService } from '../../services/storage.service';
import moment from 'moment-timezone';

export class UsersFactory {
    static create(descriptor: UserDescriptorInterface): User {
        const instance: User = new User();
        const keysToDuplicate = ['id', 'role', 'name', 'surname', 'email', 'enable', 'type', 'company','environment','menu'];

        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);

        instance.createdAt = moment.utc(descriptor.createdAt).toISOString();
        instance.defineExtraProperties();

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

        instance.defineExtraProperties();

        return instance;
    }
}
