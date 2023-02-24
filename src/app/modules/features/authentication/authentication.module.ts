import { NotificationsModule } from './../../notifications/notifications.module';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AuthenticationRoutes} from './authentication.routes';

import {AuthenticationService} from './authentication.service';
import {MaterialModule} from '../../material/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {SigninComponent} from './components/signin/signin.component';
@NgModule({
    declarations: [
        SigninComponent,

    ],
    imports: [
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
