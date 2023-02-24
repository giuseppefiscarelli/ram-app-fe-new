import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';


import {ApiService} from '@modules/network/api.service';



import {ApplicationState} from '@app/app.state';
import {SigninResponseInterface, UserDescriptorInterface} from '@configs/network/api.descriptors';

import { User } from '@app/modules/models/user.model';
import { StorageKeys } from '@app/app.costants';

import { AuthenticationSignin } from '@app/modules/store/actions/authentication.actions';
import { StorageService } from '@app/modules/services/storage.service';
import { UsersFactory } from './../../models/factories/users.factory';

@Injectable()
export class AuthenticationService {
    constructor(private API: ApiService,
                private store: Store<ApplicationState>,
                private storage: StorageService) {
    }

    signin(email, password): Observable<User> {
        return this.API.Authentication
            .signin({username: email, password})
            .pipe(
                map((response: SigninResponseInterface) => {
                    const descriptor: UserDescriptorInterface = response.user;

                    const user: User = UsersFactory.create(descriptor);

                    this.storage.set(StorageKeys.AUTH_LOGGED_USER, user);
                    this.store.dispatch(AuthenticationSignin({ payload: user }));
                })
            );
    }
}
