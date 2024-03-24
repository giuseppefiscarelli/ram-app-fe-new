import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../../config.service';
import { MailConfig } from '@app/modules/models/mailConfig.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { TYPE } from '@app/modules/notifications/values.constants';

@Component({
  selector: 'app-mail-config-edit',
  templateUrl: './mail-config-edit.component.html',
  styleUrls: ['./mail-config-edit.component.scss']
})
export class MailConfigEditComponent implements OnInit {
  mode: string;
  form: FormGroup;
  dialogTitle: string;
  btnSubmit: string;
  record:MailConfig;
  constructor(
    private services: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MailConfigEditComponent>,
    private notifications: NotificationsComponent,
  ) {
    this.mode = data.mode;
    this.record = data.record;

    if(this.mode === 'create'){
      this.dialogTitle = 'Inserimento Nuovi parametri';
      this.btnSubmit = 'Salva';
      this.form = this.initializeForCreate();
    }
    if(this.mode === 'edit'){
      this.dialogTitle = 'Aggiornamento parametri';
      this.btnSubmit = 'Salva';
      this.form = this.initializeForEdit(this.record);
    }

  }

  ngOnInit(): void {
  }
  private initializeForCreate(): FormGroup {
    return new FormGroup({
        user: new FormControl(null, [Validators.required]),
        host: new FormControl(null, [Validators.required]),
        port: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required]),

    });
  }
  private initializeForEdit(data:MailConfig): FormGroup {
    return new FormGroup({
      user: new FormControl(data.user, [Validators.required]),
      host: new FormControl(data.host, [Validators.required]),
      port: new FormControl(data.port, [Validators.required]),
      password: new FormControl(data.password, [Validators.required]),

  });
  }
  onSubmitClick(): void {
    Object
        .keys(this.form.controls)
        .map((key: string) => this.form.get(key))
        .forEach((control: AbstractControl) => {
            control.markAsDirty();
            control.markAsTouched();
        });
        console.log(this.form)
    if (this.form.valid) {
      let payload = this.form.getRawValue()
      if(this.mode === 'create'){
        this.services.createMailConfig(payload).subscribe({
          next:(res)=> {
            this.dialogRef.close(res);
            this.notifications.toast(
              TYPE.SUCCESS,
              'Operazione Completata',
              'Configurazione inserita'
            )
          },
          error:(err)=> {
            this.notifications.toast(
              TYPE.ERROR,
              'Operazione non Completata',
              'Configurazione non inserita'
            )
          }
        })

      }
      if(this.mode === 'edit'){
        this.services.createMailConfig(payload).subscribe({
          next:(res)=> {
            this.dialogRef.close(res);
            this.notifications.toast(
              TYPE.SUCCESS,
              'Operazione Completata',
              'Configurazione aggiornata'
            )
          },
          error:(err)=> {
            this.notifications.toast(
              TYPE.ERROR,
              'Operazione non Completata',
              'Configurazione non aggiornata'
            )
          }
        })
      }
    }
  }

}
