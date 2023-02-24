export enum UserRole {
  ADMINISTRATOR = 'admin',
  ADMINISTRATIVE = 'administrative',
  USER = 'user'
}
export const StorageKeys = {
  STORAGE_PREFIX: 'app.backoffice',
  AUTH_ACCESS_TOKEN: 'token',
  AUTH_ACCESS_TOKEN_EXP: 'expat',
  AUTH_LOGGED_USER: 'user'
};
export const StoreActionsKeys = {
  ACTION_AUTHENTICATION_SIGNIN: 'authentication::signin',
  ACTION_AUTHENTICATION_SIGNOUT: 'authentication::signout',
  UPDATE_LOGGED_USER: 'loggedUser::update',
};
