import { NotificationsComponent } from './../../../../notifications/notifications.component';
import { NotificationsModule } from './../../../../notifications/notifications.module';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { finalize, Observable, take } from 'rxjs';
import { AuthenticationService } from '../../authentication.service';
import { TYPE } from '@app/modules/notifications/values.constants';
import { User } from '@app/modules/models/user.model';
import { ApplicationState } from '@app/app.state';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MfaInfoComponent } from '../mfa-info/mfa-info.component';
import { environment } from '../../../../../../environments/environment.prod';

@Component({
  selector: 'app-signin',

  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {
    //button: ButtonStates;
  userMe: User;
  user: Observable<User>;
    form: FormGroup;

    loginForm = true;
    mfaCode = false;
    mfaAuthForm = false;
    mfaEnvironment: boolean = environment.mfa;
    urlCode = '';
    mfaSecret = '';
    otp = new FormControl(null, Validators.minLength(6));


    constructor(private authentication: AuthenticationService,
                private store: Store<ApplicationState>,
                 private dialog: MatDialog,
                private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private snackbar: MatSnackBar,
                private notification: NotificationsComponent) {
                  this.user = this.store.pipe(
                    select('authentication'),
                    select('user')
                );
                this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);

                  this.form = new FormGroup({
                    email: new FormControl(null, [Validators.required, Validators.email]),
                    password: new FormControl(null, [Validators.required])
                });
                 }

    ngOnInit(): void {
      console.log(this.mfaEnvironment)
      this.otp.valueChanges.subscribe({
        next:(res)=> console.log(res)
      })
    }

    mfaNext(){
      this.mfaCode = false;
      this.mfaAuthForm = true;
      this.changeDetectorRef.markForCheck();
    }

    mfaAuth(){
      const token = this.otp.value;
      const payload ={
        userSecret: this.mfaSecret,
         token: token,
         user:this.userMe
        }
      this.authentication.validateMfa(payload).subscribe({
        next:(res) => {
          console.log(res)
          if(res){
            this.router.navigate(['/'])
          }

        },

        error:(err)=> {
          this.notification.toast(TYPE.ERROR,'Codice OTP Errato')
          this.otp.setValue(null)
          this.otp.reset()
          this.changeDetectorRef.markForCheck();
        }
      })
    }
    openMfaInfo(){

      const ref: MatDialogRef<MfaInfoComponent> = this.dialog.open(
        MfaInfoComponent, {}
      );

    }

    onSubmitClick(): void {
      if (!this.form.valid ) {
          return;
      }
      this.authentication
          .signin(this.form.value.email, this.form.value.password)
          // .pipe(
          //     finalize(() => {
          //         this.changeDetectorRef.detectChanges();
          //     })
          // )
          .subscribe({
             next: (res) => {
              if(this.mfaEnvironment){
                this.userMe = res.user;
                // this.notification.toast(TYPE.SUCCESS,'Login Corretto4')
                 this.loginForm = false;
                 //console.log(res)
                 if(res.user && !res.user.mfaEnable){
                   this.urlCode = res.mfaSecret.otpauth_url;
                   this.mfaSecret = res.mfaSecret.base32;
                   this.mfaCode = true
                 }else if(res.user && res.user.mfaEnable){
                     this.mfaCode = false;
                     this.mfaAuthForm = true;
                     this.mfaSecret = res.user.mfaSecret;
                 }
              }else{
                this.router.navigate(['/'])
              }




              this.notification.toast(TYPE.SUCCESS,'Login Corretto')
              this.changeDetectorRef.markForCheck()
             //

            },
             error: (error) =>this.notification.toast(TYPE.ERROR,'Credenziali Errate')
          });
  }

}


