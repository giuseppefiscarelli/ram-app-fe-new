import {Pipe, PipeTransform} from '@angular/core';
import { UserRole } from '@app/app.costants';
import { User } from '@app/modules/models/user.model';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'UserRolePipe' })
export class UserRolePipe implements PipeTransform {
    constructor(
      private translator: TranslateService
      ) {
    }

    transform(user: User): string {
        console.log(user.role)
        switch (user.role) {
            case UserRole.ADMINISTRATOR:
               // return this.translator.instant('users.roles.administrator');
               return 'Admin'
            case UserRole.ADMINISTRATIVE:
                return 'Back Office'
                case UserRole.SUPERADMIN:
                  return 'Super Admin'
                //return this.translator.instant('users.roles.administration');
                case UserRole.USER:
                return this.translator.instant('users.roles.user');
                return 'Utente'

        }
    }
}
