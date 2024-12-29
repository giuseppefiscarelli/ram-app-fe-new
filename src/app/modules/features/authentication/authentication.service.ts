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
import { HttpBackend, HttpClient } from '@angular/common/http';

@Injectable()
export class AuthenticationService {
  ipAddress: any;
    urlAddress: string;
    constructor(private API: ApiService,
      private http: HttpClient,
      private handler: HttpBackend,
                private store: Store<ApplicationState>,
                private storage: StorageService) {

                  this.http = new HttpClient(handler);
                  this.urlAddress ='https://jsonip.com'
                //  this.getIPAddress();
    }
    public getIPAddress(){
      this.http.get<{ip: string}>('https://jsonip.com')
      .subscribe( data => {
          this.ipAddress =data.ip
          return this.ipAddress
      });
  }
    signin(email, password): Observable<{user:User, mfaSecret:any}>{
        return this.API.Authentication
        .signin({username: email, password, ip: this.ipAddress})
            .pipe(
                map((response: SigninResponseInterface) => {
                    const descriptor: UserDescriptorInterface = response.user;

                    const user: User = UsersFactory.create(descriptor);
                    return {user, mfaSecret: response.auth.mfaSecret}
                    // this.storage.set(StorageKeys.AUTH_LOGGED_USER, user);
                    // this.store.dispatch(AuthenticationSignin({ payload: user }));
                })
            );
    }

    validateMfa(payload:any){
      return this.API.Authentication.validateMfa(payload).pipe(
        map((response: SigninResponseInterface) => {
            console.log(response)
            const descriptor: UserDescriptorInterface = response.user;
            const user: User = UsersFactory.create(descriptor);
            this.storage.set(StorageKeys.AUTH_LOGGED_USER, user);
            this.store.dispatch(AuthenticationSignin({ payload: user }));
            return user
          })
    )
    }

}
