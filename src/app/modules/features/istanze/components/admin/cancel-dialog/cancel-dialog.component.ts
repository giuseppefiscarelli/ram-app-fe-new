import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationState } from '@app/app.state';
import { IstanzeService } from '@app/modules/features/istanze/istanze.service';
import { Istanza, Rendicontazione } from '@app/modules/models/istanza.model';
import { User } from '@app/modules/models/user.model';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import Swal from 'sweetalert2';
import { TYPE } from '@app/modules/notifications/values.constants';

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.scss']
})
export class CancelDialogComponent implements OnInit {
    mode: string;
    dialogTitle: string;
    btnSubmit: string;
    btnClose: string;
    form: FormGroup;
    istanza: Istanza;
    rendicontazione: Rendicontazione;
    user: Observable<User>;
    userMe: User;
    isLoading: boolean
    constructor(

      @Inject(MAT_DIALOG_DATA) public data: any,
      private service: IstanzeService,
      private store: Store<ApplicationState>,
      private dialogRef: MatDialogRef<CancelDialogComponent>,
      private notifications : NotificationsComponent,

    ) {

      this.user = this.store.pipe(select('authentication'), select('user'));
      this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
      this.istanza = data.istanza;
      this.mode = data.mode;
      this.service.getRendicontazione(this.istanza.id_ram.toString()).subscribe(
        (res) => {
            this.rendicontazione = res;
            console.log(this.rendicontazione)
            if (this.rendicontazione.status !== 'canceled'){
                this.dialogTitle = 'Annullamento Istanza - ID RAM '+ this.rendicontazione.id_ram;
                this.btnSubmit= 'Esegui annullamento';
                this.form = this.initializeForEdit(this.rendicontazione);
                this.btnClose='Esci senza annullare';
            }
            else{
                this.dialogTitle = 'Info Annullamento Istanza';
                this.btnClose='Esci'

            }
            this.isLoading = false
        }
    )
    }

    ngOnInit(): void {
    }
    initializeForEdit(rend):FormGroup{
      return new FormGroup({
          id: new FormControl(rend.id),
          id_ram: new FormControl(rend.id_ram),
          status: new FormControl('canceled'),
          canceled:  new FormControl(true),
          dateCanceled:  new FormControl(null),
          userCanceled: new FormControl(this.userMe.email),
          noteCanceled:  new FormControl(null,[Validators.required]),
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
      if(this.form.valid){
          const payload= this.form.getRawValue();
          payload.dateCanceled = new Date().getTime().toString();

          Swal.fire({
              title: 'Vuoi annullare l\'istanza?!',
              text: 'Non potrai più riattivarla',
              icon: 'warning',
              footer: 'L\'operazione è irreversibile',
              showCancelButton: true,
              allowOutsideClick: false,
              confirmButtonText:'SI Conferma annullamento',
              cancelButtonText: 'NO Esci senza annullare'
            }).then( (res) => {

                  if (res && res.value){
                      console.log(payload)
                       this.service.updateRendicontazione(payload).subscribe(
                          (res: Rendicontazione)=> {
                              if(res){
                                  this.dialogRef.close(res)
                                //  this.notifications.success('Operazione Completata', 'Istanza annullata con successo')
                                this.notifications.toast(TYPE.SUCCESS,'Operazione Completata', 'Istanza annullata con successo')
                              }
                          }
                      )
                  }
                  this.dialogRef.close(null)
            });


         /*
          ) */

      }
    }

}
