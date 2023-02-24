import {Routes} from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';

export const AuthenticationRoutes: Routes = [{
    path: 'signin',
    component: SigninComponent
}];
