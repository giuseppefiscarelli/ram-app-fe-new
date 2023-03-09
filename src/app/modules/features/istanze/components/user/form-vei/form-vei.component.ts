import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationState } from '@app/app.state';
import { Istanza } from '@app/modules/models/istanza.model';
import { User } from '@app/modules/models/user.model';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { TYPE } from '@app/modules/notifications/values.constants';

@Component({
  selector: 'app-form-vei',
  templateUrl: './form-vei.component.html',
  styleUrls: ['./form-vei.component.scss']
})
export class FormVeiComponent implements OnInit {
    mode: string;
    dialogTitle: string;
    btnSubmit: string;
    form: FormGroup;
    istanza: Istanza;
    typeVei:{
        id?:number;
        catVei: number;
        description: string;
        longDescription: string;
        artDm: string;
        campoDb: string
        typeDocument:[];
    }
    categoriaLabel:string;
    tipoLabel: string;
    user: Observable<User>;
    userMe: User;
    constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
                  private services: IstanzeService,
                  private store: Store<ApplicationState>,
                  private dialogRef: MatDialogRef<FormVeiComponent>,
                  private notifications: NotificationsComponent,
                  ) {

                    this.user = this.store.pipe(select('authentication'), select('user'));
                    this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);

                    this.mode = data.mode;
                    this.istanza = data.istanza;
                    this.typeVei = data.typeVei;

                    if(this.mode === 'create'){
                      this.dialogTitle = 'Inserimento Nuovo Veicolo';
                      this.btnSubmit = 'Salva dati veicolo';
                      this.form = this.initializeForCreate();
                    }
                    if(this.mode === 'edit'){
                        this.dialogTitle = 'Aggiornamento Veicolo';
                        this.btnSubmit = 'Salva dati veicolo';
                        this.form = this.initializeForEdit(data.vei);
                    }
                   }

    ngOnInit() {
    }
    onSubmitBtn(mode):void{
      Object
      .keys(this.form.controls)
      .map((key: string) => this.form.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });
      if (this.form.valid){
          const payload = this.form.value;

          if(this.mode === 'create'){
              //console.log(payload)
              this.services
                  .createVeicolo(payload)
                  .subscribe(
                      (record:Veicolo) => {
                          this.dialogRef.close(record);
                          this.notifications.toast(
                              TYPE.SUCCESS,
                              'Operazione Completata',
                              'Dati Veicolo inseriti con successo'
                          );
                      }
                  )

          }
          if(this.mode ==='edit'){
              this.services
              .updateVeicolo(payload)
              .subscribe(
                  (record:Veicolo) => {
                      this.dialogRef.close(record);
                      this.notifications.toast(
                            TYPE.SUCCESS,
                          'Operazione Completata',
                          'Dati Veicolo Aggiornati con successo'
                      );
                  }
              )
          }
      }
  }
    initializeForCreate(): FormGroup{
        return new FormGroup({
          id_ram: new FormControl(this.istanza.id_ram),
          category:new FormControl(this.typeVei.catVei),
          type:new FormControl(this.typeVei.campoDb),
          licensePlate: new FormControl(null, [Validators.required]),
          brand: new FormControl(null, [Validators.required]),
          model: new FormControl(null, [Validators.required]),
          acquisitionType: new FormControl(null, [Validators.required]),
          amount: new FormControl(null, [Validators.required]),
          userIns:new FormControl(this.userMe.email),
        })
    }
    initializeForEdit(data:Veicolo): FormGroup{
        return new FormGroup({
          id: new FormControl(data.id),

          licensePlate: new FormControl(data.licensePlate, [Validators.required]),
          brand: new FormControl(data.brand, [Validators.required]),
          model: new FormControl(data.model, [Validators.required]),
          acquisitionType: new FormControl(data.acquisitionType, [Validators.required]),
          amount: new FormControl(data.amount, [Validators.required]),

        })
    }

}
