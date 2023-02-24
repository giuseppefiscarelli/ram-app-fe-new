import {createAction, props} from '@ngrx/store';
import { StoreActionsKeys } from '../../../app.costants';


export const AuthenticationSignin = createAction(
    StoreActionsKeys.ACTION_AUTHENTICATION_SIGNIN,
    props<{ payload: any }>()
);

export const AuthenticationSignout = createAction(
    StoreActionsKeys.ACTION_AUTHENTICATION_SIGNOUT
);
export const UpdateUser = createAction(
  StoreActionsKeys.UPDATE_LOGGED_USER,
  props<{ payload: any}>()
);
