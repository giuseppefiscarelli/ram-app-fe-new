import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationState } from '@app/app.state';
import { Istanza } from '@app/modules/models/istanza.model';
import { User } from '@app/modules/models/user.model';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';
import { Allegato } from '@app/modules/models/allegato.model';
import { TYPE } from '@app/modules/notifications/values.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-allegato',
  templateUrl: './form-allegato.component.html',
  styleUrls: ['./form-allegato.component.scss']
})
export class FormAllegatoComponent implements OnInit {
    mode: string;
    dialogTitle: string;
    btnSubmit: string;
    form: FormGroup;
    istanza: Istanza;
    user: Observable<User>;
    userMe: User;
    type: [];
    fileName = '';
    fileAttach: File;

    typeFileControl:boolean;
    fileDimControl: boolean;
    constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
                  private services: IstanzeService,
                  private store: Store<ApplicationState>,
                  private dialogRef: MatDialogRef<FormAllegatoComponent>,
                  private notifications: NotificationsComponent,
                  ) {
                    //console.log(data)
                    this.user = this.store.pipe(select('authentication'), select('user'));
                    this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
                    this.mode = data.mode;
                    this.istanza = data.istanza;
                    this.type = data.type;
                    //console.log(this.type['description'])

                  //  console.log(this.type)

                    if(this.mode ==='create'){
                        this.dialogTitle = 'Inserimento Allegato Dichiarazione';
                        this.btnSubmit= 'Salva Allegato';
                        this.form = this.initializeForCreate();
                        this.fileDimControl =false;
                        this.typeFileControl = false;
                    }
                    if(this.mode === 'edit'){

                        this.dialogTitle = 'Aggiornamneto Allegato Dichiarazione';
                        this.btnSubmit= 'Aggiorna Allegato';
                        this.form = this.initializeForEdit(data.allegato);
                        this.fileDimControl =true;
                        this.typeFileControl = true;
                    }
                   }

    ngOnInit(): void {
    }
    onSubmitBtn():void{
      Object
      .keys(this.form.controls)
      .map((key: string) => this.form.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });
     // console.log(this.fileAttach)
      //console.log(this.form)


      if(this.form.valid){
          const payload= this.form.value;
          if(this.type['description'] ==='ampl'){
              payload.jsonData = {
                  unita_lavorative : null,
                  volumi_fatturato: null

              };
          }else{
              payload.jsonData = {
                  unita_lavorative : payload.unitaLavorative,
                  volumi_fatturato: payload.volumiFatturato

              };
          }

          if((!this.fileAttach && this.mode === 'create') || (this.mode === 'edit' && !this.form.controls.attach.value)){
          Swal.fire({
              title: 'Attenzione!',
              text: 'Si prega di caricare un documento!',
              icon: 'warning',
              showCancelButton: false,
              allowOutsideClick: false
            })
          }
          if(this.mode === 'create'){

              this.services.uploadAllegato(this.fileAttach).subscribe(
                  (res)=> {

                      const filenameS: string = res.file[0].fd.substring(res.file[0].fd.lastIndexOf('/') + 1);
                      payload.filenameStorage = filenameS;
                      payload.fd = {
                          fd:  res.file[0].fd,
                          filename: res.file[0].filename,
                          type: res.file[0].type,
                          filenameStorage: filenameS
                      }


                      payload.dataUpload = new Date().getTime()
                     // console.log(payload)
                      this.services.createAllegato(payload).subscribe(
                          (res:Allegato) => {
                              this.notifications.toast(
                                TYPE.SUCCESS,
                                  'Operazione Completata','Documento Caricato con Successo'
                              )
                              this.dialogRef.close(res)
                          }
                  )
                  },
                  (err)=> console.log(err)
              )
          }
          if(this.mode === 'edit'){
              if(this.fileAttach){
                  this.services.uploadAllegato(this.fileAttach).subscribe(
                      (res)=> {

                          const filenameS: string = res.file[0].fd.substring(res.file[0].fd.lastIndexOf('/') + 1);
                          payload.filenameStorage = filenameS;
                          payload.fd = {
                              fd:  res.file[0].fd,
                              filename: res.file[0].filename,
                              type: res.file[0].type,
                              filenameStorage: filenameS
                          }

                          payload.dataUpload = new Date().getTime()
                        //  console.log(payload)

                          this.services.updateAllegato(payload).subscribe(
                              (res:Allegato) => {
                                  this.notifications.toast(
                                    TYPE.SUCCESS,
                                      'Operazione Completata','Documento Aggiornato con Successo'
                                  )
                                  this.dialogRef.close(res)
                              }
                      )
                      },
                      (err)=> console.log(err)
                  )
              }else{
                  this.services.updateAllegato(payload)
                  .subscribe(
                      (res:Allegato) => {
                          this.notifications.toast(
                            TYPE.SUCCESS,
                              'Operazione Completata','Documento Aggiornato con Successo'
                          )
                          this.dialogRef.close(res)
                      }
                  )
              }
          }


      }

  }
  initializeForCreate():FormGroup{
      if(this.type['description'] ==='ampl'){
          return new FormGroup({
              attach: new FormControl(false, [Validators.requiredTrue]),
              id_ram: new FormControl(this.istanza.id_ram),
              typeDocument: new FormControl(this.type['description']),
              userUpload: new FormControl(this.userMe.email),
              filenameUpload: new FormControl(null),

              note: new FormControl(null),
          })
      }else{
      return new FormGroup({
          attach: new FormControl(false, [Validators.requiredTrue]),
          id_ram: new FormControl(this.istanza.id_ram),
          typeDocument: new FormControl(this.type['description']),
          userUpload: new FormControl(this.userMe.email),
          filenameUpload: new FormControl(null),
          unitaLavorative:new FormControl(null, [Validators.required]),
          volumiFatturato:new FormControl(null, [Validators.required]),
          note: new FormControl(null),
      })
  }
  }
  initializeForEdit(data: Allegato):FormGroup{
      this.fileDimControl = this.typeFileControl= true;
      this.fileName = data.filenameUpload;
      if(this.type['description'] ==='ampl'){
          return new FormGroup({
              id: new FormControl(data.id),
              attach: new FormControl(true, [Validators.requiredTrue]),
              filenameUpload: new FormControl(data.filenameUpload),

              note: new FormControl(data.note),
          })
      }else{
          return new FormGroup({
              id: new FormControl(data.id),
              attach: new FormControl(true, [Validators.requiredTrue]),
              filenameUpload: new FormControl(data.filenameUpload),
              unitaLavorative:new FormControl(data.jsonData['unita_lavorative'], [Validators.required]),
              volumiFatturato:new FormControl(data.jsonData['volumi_fatturato'], [Validators.required]),
              note: new FormControl(data.note),
          })
      }

  }
  selectFile(event: any): void {
      this.fileAttach = event.target.files[0];
    //   this.fileName = this.fileAttach.name;
    //   console.log(this.fileAttach.type)
    //   if(this.fileAttach.type === 'application/pdf' || this.fileAttach.type === 'application/pkcs7-mime' || this.fileAttach.type === 'application/x-pkcs7-mime'){
    //       this.typeFileControl = true;
    //   }
    //   if(this.fileAttach.size < 4194304){
    //       this.fileDimControl = true;
    //   }
    //   if(this.fileDimControl && this.typeFileControl){
    //       this.form.controls.attach.setValue(true)
    //   }else{
    //       this.form.controls.attach.setValue(false)
    //   }
      ////new control

     if(!this.fileAttach){
        this.typeFileControl = false;
        this.fileDimControl = false;
        this.form.controls.attach.setValue(false);
        this.fileName = null;
        return;
     }
     this.fileName = this.fileAttach.name;
     this.form.controls.filenameUpload.setValue(this.fileAttach.name);
    // console.log(this.fileAttach)
     if (this.fileAttach.type === 'application/pdf' ||
        this.fileAttach.type === 'application/pkcs7-mime' ||
        this.fileAttach.type === 'application/x-pkcs7-mime' ||
        this.fileAttach.type === 'application/pkcs7' ||
        this.fileAttach.type === 'application/pkcs-crl' ||
        this.fileAttach.type === 'application/pkcs10' ||
        this.fileAttach.type === 'application/x-pkcs10' ||
        this.fileAttach.type === 'application/pkcs-12' ||
        this.fileAttach.type === 'application/x-pkcs12' ||
        this.fileAttach.type === 'application/x-pkcs7-signature' ||
        this.fileAttach.type === 'application/x-pkcs7-certreqresp' ||
        this.fileAttach.type === 'application/pkcs7-signature' ||
        this.fileAttach.name.endsWith('.p7m') ||  this.fileAttach.name.endsWith('.pdf')
    ) {
        this.typeFileControl = true;
        this.form.controls.attach.setValue(false);
        let limit = this.userMe.role === 'user'?4194304:10194304
        if(this.fileAttach.size < limit){
            this.fileDimControl = true;
            this.form.controls.attach.setValue(true)
        }

        return
    } else {
        console.log("Tipo di file non supportato");
        this.typeFileControl = false;
        this.fileDimControl = false;
        this.form.controls.attach.setValue(false);

        return;
    }


      //this.form.controls.filenameUpload.setValue(this.fileAttach.name)

  }
  deleteFile(): void{
      this.fileAttach = null;
      this.fileName = '';
      this.form.controls.filenameUpload.setValue(null)
      this.form.controls.attach.setValue(false)
      this.fileDimControl = this.typeFileControl= false;
   }

}
