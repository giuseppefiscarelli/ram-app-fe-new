import { NotificationsComponent } from './../../../../notifications/notifications.component';
import { NotificationsModule } from './../../../../notifications/notifications.module';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize, Observable, take } from 'rxjs';
import { AuthenticationService } from '../../authentication.service';
import { TYPE } from '@app/modules/notifications/values.constants';
import { User } from '@app/modules/models/user.model';
import { ApplicationState } from '@app/app.state';
import { select, Store } from '@ngrx/store';

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
    constructor(private authentication: AuthenticationService,
                private store: Store<ApplicationState>,
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
    }

    onSubmitClick(): void {
      if (!this.form.valid ) {
          return;
      }
      this.authentication
          .signin(this.form.value.email, this.form.value.password)
          .pipe(
              finalize(() => {
                  this.changeDetectorRef.detectChanges();
              })
          )
          .subscribe({
             next: () => {
              this.notification.toast(TYPE.SUCCESS,'Login Corretto')

              this.router.navigate(['/'])},
             error: (error) =>this.notification.toast(TYPE.ERROR,'Credenziali Errate')
          });
  }

}
