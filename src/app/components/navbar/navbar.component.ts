import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonToggle } from '@angular/material/button-toggle';

import { StorageKeys } from '@app/app.costants';
import { ApplicationState } from '@app/app.state';
import { User } from '@app/modules/models/user.model';
import { StorageService } from '@app/modules/services/storage.service';
import { AuthenticationSignout } from '@app/modules/store/actions/authentication.actions';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyProfileComponent } from '../../modules/features/users/components/my-profile/my-profile.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() status: boolean;
  @Output() statusEmit = new EventEmitter();
  @Input() mobile: boolean;
  user: Observable<User>;
  userMe: User;
  constructor(  private store: Store<ApplicationState>,
                private translation: TranslateService,
                private storage: StorageService,
                private router: Router,
                  private dialog: MatDialog,
    ) {
    this.user = this.store.pipe(
      select('authentication'),
      select('user')
  );
  this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);

  }

  ngOnInit() {


  }
  sidenavToggle(status){

    this.status = !status;
    console.log(status);
    this.statusEmit.emit(this.status)
  }
  setLang(lang){
    console.log(lang)
   // this.translation.addLangs
   this.translation.setDefaultLang(lang)
  }
  onLogoutClick(): void {
    this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN);
    this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN_EXP);
    this.storage.unset(StorageKeys.AUTH_LOGGED_USER);

    this.store.dispatch(AuthenticationSignout());

    this.router.navigate(['/auth/signin']);
}

onClickMyProfile(){
  const refCreate: MatDialogRef<MyProfileComponent> = this.dialog.open(
    MyProfileComponent, {disableClose: true,minWidth:'50%',data:{user:this.userMe}}
              );
              refCreate.afterClosed().subscribe(
                (user: User) => {

                }
              );
}



}
