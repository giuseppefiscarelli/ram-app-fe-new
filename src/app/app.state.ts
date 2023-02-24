import { AuthenticationState } from "./modules/store/states/authentication.state";


export interface ApplicationState {
    authentication: AuthenticationState;
}
