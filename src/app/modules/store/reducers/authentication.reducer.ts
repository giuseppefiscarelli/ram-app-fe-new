import {createReducer, on} from '@ngrx/store';
import { User } from '../../models/user.model';
import { AuthenticationSignin, AuthenticationSignout, UpdateUser } from '../actions/authentication.actions';
import { AuthenticationState, defineAuthenticationInitialState } from '../states/authentication.state';


const initialState: AuthenticationState = defineAuthenticationInitialState();
const reducer = createReducer(
    initialState,
    on(AuthenticationSignin, (state: AuthenticationState, action: { payload: User }) => ({
        ...state,
        user: action.payload
    })),
    on(AuthenticationSignout, (state: AuthenticationState, action: {}) => ({
        ...state,
        user: null
    })),
    on(UpdateUser, (state: AuthenticationState, action: { payload: User}) => ({
        ...state,
        user: action.payload
    }))
);

export function AuthenticationReducer(state: AuthenticationState, action): any {
    return reducer(state, action);
}
