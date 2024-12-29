import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { User } from '@app/modules/models/user.model';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { ApplicationState } from '@app/app.state';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-my-profile',

  template: `<h2 mat-dialog-title>Informazioni Profilo</h2>
  <mat-dialog-content>
    <div class="row-custom" *ngIf="this.userMe">
    <mat-list>
    <mat-list-item>
      <mat-icon mat-list-icon>person</mat-icon>

      <div mat-line> {{this.userMe.email}} </div>
      <div mat-line>Username / email</div>
    </mat-list-item>
    <mat-list-item>


      <div mat-line> Codice  Authenticator Multifattore </div>

    </mat-list-item>


    </mat-list>



    </div>
    <div class="row-custom" *ngIf="this.userMe">

    <qrcode
              [qrdata]=" this.qrdata"
              [width]="256"
              [errorCorrectionLevel]="'M'"
              style="text-align:center"
          ></qrcode>
    </div>
   </mat-dialog-content>
   <mat-dialog-actions>
  <button mat-button color="warn" mat-dialog-close><mat-icon>close</mat-icon> Chiudi</button>

</mat-dialog-actions>

  `,
  styleUrls: ['./my-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent implements OnInit {

  user: Observable<User>;
   userMe: User;

   qrdata = '';

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
     private store: Store<ApplicationState>,
   ){
    console.log(data)
    this.userMe = data.user;

    if(this.userMe.mfaEnable){

      this.qrdata = 'otpauth://totp/RAM Spa:Investimenti VIII ('+this.userMe.email+') ?secret='+this.userMe.mfaSecret


    }

    console.log(this.qrdata)


   }


   ngOnInit(): void {
    console.log(this.qrdata)
   }
 }


