import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { statusCheck } from './../../../../../../app.costants';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Allegato } from '@app/modules/models/allegato.model';
import { User } from '@app/modules/models/user.model';
import { Observable, take } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationState } from '@app/app.state';
import { select, Store } from '@ngrx/store';
import { IstanzeService } from '../../../istanze.service';
import { AdminDialogAllegatoComponent } from '../admin-dialog-allegato/admin-dialog-allegato.component';
import { TYPE } from '@app/modules/notifications/values.constants';

@Component({
  selector: 'app-admin-veicolo-dialog',
  templateUrl: './admin-veicolo-dialog.component.html',
  styleUrls: ['./admin-veicolo-dialog.component.scss']
})
export class AdminVeicoloDialogComponent implements OnInit {
  allegato: Allegato;
   url: string;
   form: FormGroup;
   user: Observable<User>;
   userMe: User;

   dialogTitle: string;
   btnSubmit: string;
   btnClose: string;
   type:string;

   statusCheck:statusCheck;

   filterOptionsDescriptors: {
    [key: string]: any
    };
    constructor(
                @Inject(MAT_DIALOG_DATA) public data: any,
                private services: IstanzeService,
                private changeDetectorRef: ChangeDetectorRef,
                private store: Store<ApplicationState>,
                private dialogRef: MatDialogRef<AdminDialogAllegatoComponent>,
                private notifications: NotificationsComponent,
                private route: ActivatedRoute,
                private router: Router,
    ) {
      this.allegato = data.allegato;
      this.dialogTitle = 'Info Allegato Dichiarazione';
      this.btnSubmit= 'Aggiorna informazioni e stato lavorazione';
      this.type='cert';
      this.filterOptionsDescriptors = {
          statusCheck: [

          ]
      };

      Object.keys(statusCheck)
      .filter(x => x === 'ACCEPTED' || x === 'PENDING' || x === 'REJECTED')
      .map((status: string) => (

          this.filterOptionsDescriptors.statusCheck.push(
              {
                  title: statusCheck[status],
                  value: statusCheck[status]
              }
          )
      ));
      if(this.allegato.id_Veicolo){
          this.dialogTitle = 'Info Allegato Veicolo';
          this.btnSubmit= 'Aggiorna informazioni e stato lavorazione';
          this.type='vehicle';
      }
      this.url = data.url
      this.user = this.store.pipe(select('authentication'), select('user'));
      this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);

      this.form = this.initializeForEdit(this.allegato)
    }

    ngOnInit(): void {
    }
    initializeForEdit(alle): FormGroup{
      return new FormGroup({
          id: new FormControl(alle.id),
          adminState : new FormControl(alle.adminState, [Validators.required]),
          adminNote : new FormControl(alle.adminNote),
          adminDate : new FormControl(),
          adminUser : new FormControl(),

      })
  }
  onSubmitBtn(){
      Object
      .keys(this.form.controls)
      .map((key: string) => this.form.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });

      if (this.form.valid){
          const payload = this.form.value;
        //  console.log(payload)
          Object.keys(payload).forEach(key => {
              if (payload[key] === undefined || payload[key] === null ) {
                  delete payload[key];
              }
          });

          this.services.updateAllegato(payload).subscribe(
              {
                  next:(res) => {
                      this.notifications.toast(TYPE.SUCCESS,'Operazione Completata','Informazioni aggiornate con successo')
                      this.dialogRef.close(res)
                  },
                  error:(err)=>{

                      this.notifications.toast(TYPE.ERROR,'Operazione Non Completata','Errore aggiornamento informazioni')

                  }

              }
          )

      }
  }

  viewAllegato(file): void{

      this.services.getFile(file)
      .subscribe(
          (res) => {
              const blob = new Blob([res],{type: file.type});
              const url = window.URL.createObjectURL(blob);
             window.open(url);

          },
              error => console.log('Error downloading the file.')
          );
  }

  downloadAllegato(file): void{

      this.services.getFile(file)
      .subscribe(
        (res) => {
            const blob = new Blob([res], {type: file.type});
            // const url = window.URL.createObjectURL(blob);
            // window.open(url);
            const objectUrl: string = URL.createObjectURL(blob);
            const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
            a.href = objectUrl;
            a.download = file.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
        },
        error => console.log('Error downloading the file.')
        );
  }

}
