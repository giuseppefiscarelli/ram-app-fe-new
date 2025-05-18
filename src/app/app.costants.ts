export enum UserRole {
  ADMINISTRATOR = 'admin',
  SUPERADMIN = 'superadmin',
  ADMINISTRATIVE = 'administrative',
  USER = 'user',
   VIEWER = 'viewer'
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

export enum statusCheck {
  TOWORK = 'toWork',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  FILEUPLOAD = 'fileUpload',
  NOTFOUND = 'notFound',

}
export enum statusAdminVei {
  toWork = 'toWork',
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
  integrationRequest = 'integrationRequest',


}

export enum typeReport{
  integrazione='integrazione',
  ammissione= 'ammissione',
  inammissibilita='inammissibilita',
  rigetto='rigetto'

}
