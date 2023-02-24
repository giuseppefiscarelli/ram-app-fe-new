import {Injectable} from '@angular/core';
import { UserDescriptorInterface } from '@app/config/network/api.descriptors';
import { UsersFactory } from '@app/modules/models/factories/users.factory';
import { User } from '@app/modules/models/user.model';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiService} from './../../network/api.service'


@Injectable()
export class UsersService {
    constructor(private API: ApiService) {
    }

    fetch(payload?: any): Observable<User[]> {
        return this.API.Users.fetch(payload)
            .pipe(
                map((users: UserDescriptorInterface[]) => users.map((user: UserDescriptorInterface) => UsersFactory.create(user)))
            );
    }
    getUser(id: number): Observable<User> {
        return this.API.Users.get({id})
        .pipe(
            map((user: UserDescriptorInterface) =>
             UsersFactory.create(user))
        );
    }
    create(payload: any): Observable<User> {
        return this.API.Users.create(payload)
            .pipe(
                map((user: UserDescriptorInterface) => UsersFactory.create(user))
            );
    }

    update(payload: UserDescriptorInterface): Observable<User> {
        return this.API.Users.update(payload)
            .pipe(
                map((user: UserDescriptorInterface) => UsersFactory.create(user))
            );
    }

    delete(id: number): Observable<any> {
        return this.API.Users.delete({ id });
    }

    updateMe(payload: any): Observable<User> {
        return this.API.Users.updateMe(payload)
            .pipe(
                map((user: UserDescriptorInterface) => UsersFactory.create(user))
            );
    }
    /*
    getEmployee(id: number): Observable<Employee> {
        return this.API.Employee.get({id})
        .pipe(
            map((user: EmployeesDescriptorInterface) =>
            EmployeesFactory.create(user))
        );
    }
    createEmployee(payload: any): Observable<Employee> {
        return this.API.Employee.create(payload)
            .pipe(
                map((user: EmployeesDescriptorInterface) => EmployeesFactory.create(user))
            );
    }
    updateEmployee(payload: any): Observable<Employee> {
        return this.API.Employee.update(payload)
            .pipe(
                map((user: EmployeesDescriptorInterface) => EmployeesFactory.create(user))
            );
    }*/

}
