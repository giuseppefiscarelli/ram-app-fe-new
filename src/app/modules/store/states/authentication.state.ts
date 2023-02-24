import { UsersFactory } from "../../models/factories/users.factory";
import { User } from "../../models/user.model";


export interface AuthenticationState {
    user: User;
}

export function defineAuthenticationInitialState(): AuthenticationState {
    return {
        user: UsersFactory.restore()
    };
}
