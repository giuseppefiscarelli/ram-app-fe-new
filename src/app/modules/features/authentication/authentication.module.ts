import { NotificationsModule } from './../../notifications/notifications.module';
import {NgModule} from '@angular/core';


import {AuthenticationRoutes} from './authentication.routes';

import {AuthenticationService} from './authentication.service';
import {MaterialModule} from '../../material/material.module';

import {SharedModule} from '../../shared/shared.module';
import {SigninComponent} from './components/signin/signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { NgOtpInputModule } from 'ng-otp-input';
@NgModule({
    declarations: [
        SigninComponent,

    ],
    imports: [
      NgOtpInputModule,
      QRCodeModule,
        SharedModule,
        RouterModule.forChild(AuthenticationRoutes),
        ReactiveFormsModule,
        NotificationsModule.forRoot()

    ],
    providers: [
        AuthenticationService
    ]
})
export class AuthenticationModule {
}
