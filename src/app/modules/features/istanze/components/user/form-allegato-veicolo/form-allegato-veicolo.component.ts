import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationState } from '@app/app.state';
import { Allegato } from '@app/modules/models/allegato.model';
import { Istanza } from '@app/modules/models/istanza.model';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { User } from '@app/modules/models/user.model';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';
import { TYPE } from '@app/modules/notifications/values.constants';
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-allegato-veicolo',
  templateUrl: './form-allegato-veicolo.component.html',
  styleUrls: ['./form-allegato-veicolo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormAllegatoVeicoloComponent implements OnInit {
    mode: string;
    dialogTitle: string;
    btnSubmit: string;
    form: FormGroup;
    istanza: Istanza;
    user: Observable<User>;
    userMe: User;
    type: TypeDocument;
    typeDocuments: TypeDocument[];
    fileName = '';
    fileAttach: File;
    fields=[];
    docList=[];
    veicolo: Veicolo;
    filteredType: TypeDocument[];

    typeFileControl:boolean;
    fileDimControl: boolean;
    listOfPlaceholder: string[];
    visibleForm: boolean;
    allegato: Allegato;

    public dipTypeCtrl: FormControl = new FormControl();
    constructor(   @Inject(MAT_DIALOG_DATA) public data: any,
                    private services: IstanzeService,
                    private changeDetectorRef: ChangeDetectorRef,
                    private store: Store<ApplicationState>,
                    private dialogRef: MatDialogRef<FormAllegatoVeicoloComponent>,
                    private notifications: NotificationsComponent,
                    private route: ActivatedRoute,
                    private router: Router) {
                      this.user = this.store.pipe(select('authentication'), select('user'));
                      this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
                      this.mode = data.mode;
                      this.istanza = data.istanza;
                      this.veicolo = data.veicolo;
                      this.typeDocuments = data.typeDocuments;
                      this.docList = data.docList;
                      this.visibleForm = false;


                      if(this.mode === 'create'){
                          if(this.veicolo.acquisitionType === '01'){
                            this.filteredType = this.typeDocuments.filter( (x)=> this.docList.includes(x.id) && x.id !== 9);
                          }else{
                            this.filteredType = this.typeDocuments.filter( (x)=> this.docList.includes(x.id));
                          }
                          this.listOfPlaceholder=[];
                          this.dialogTitle = 'Inserimento Allegato Veicolo';
                          this.btnSubmit= 'Salva Allegato';

                      }
                      if(this.mode === 'edit'){
                          this.listOfPlaceholder=[];
                          this.filteredType = this.typeDocuments.filter( (x)=> this.docList.includes(x.id))
                          this.dialogTitle = 'Aggiornamento Allegato Veicolo';
                          this.btnSubmit= 'Aggiorna Allegato';
                          this.form = new FormGroup({});
                          this.type = this.typeDocuments.find(x=> x.id === Number(data.allegato.typeDocument))
                          this.fields = data.allegato.jsonData;
                          this.fileDimControl =true;
                          this.typeFileControl = true;
                          this.initializeForEdit(data.allegato);

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

      if((!this.fileAttach && this.mode === 'create') || (this.mode === 'edit' && !this.form.controls.attach.value)){
          Swal.fire({
              title: 'Attenzione!',
              text: 'Si prega di caricare un documento!',
              icon: 'warning',
              showCancelButton: false,
              allowOutsideClick: false
            })
      }
      if(this.form.valid){
          const payload= this.form.value;
          payload.jsonData = [];
          this.fields.map(
              (x, i)=>{
                  Object
                  .keys(this.form.controls)
                  .map((key) => {
                      this.form.get(key)
                      if(i === Number(key)){
                          let value = this.form.get(key).value
                          if(x.type === 'date'){
                              value = moment(this.form.get(key).value).format('YYYY-MM-DD')
                          }
                          x.value =value
                          payload.jsonData.push(x)
                      }
                  })
              }
          )

          //console.log(this.fileAttach)
          //console.log(payload)
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
                      //console.log(payload)
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
              //console.log(payload)
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
                         // console.log(payload)
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
    initializeForCreate(): void{

      this.fields.forEach((x,index)=>{
          this.form.addControl(index.toString(),new FormControl(null, [Validators.required]))
          this.listOfPlaceholder.push(x.description);
      })
      this.form.addControl('id_ram',new FormControl(this.istanza.id_ram))
      this.form.addControl('id_Veicolo',new FormControl(this.veicolo.id))
      this.form.addControl('typeVei',new FormControl(this.veicolo.type))
      this.form.addControl('userUpload',new FormControl(this.userMe.email))
      this.form.addControl('typeDocument',new FormControl(this.type.id))
      this.form.addControl('filenameUpload',new FormControl())
      this.form.addControl('attach',new FormControl(false, [Validators.requiredTrue]))
      this.form.addControl('note',new FormControl(null))


  }
  initializeForEdit(data: Allegato): void{

      this.fields.forEach((x,index)=>{
          this.form.addControl(index.toString(),new FormControl(x.value))
          this.listOfPlaceholder.push(x.description);
      })
      this.form.addControl('id',new FormControl(data.id))
      this.form.addControl('userUpload',new FormControl(this.userMe.email))
      this.form.addControl('filenameUpload',new FormControl(data.filenameUpload))
      this.form.addControl('attach',new FormControl(true, [Validators.requiredTrue]))
      this.form.addControl('note',new FormControl(data.note))
      this.fileName = data.filenameUpload;

      this.visibleForm = true;

  }
  initializeForCreate1():FormGroup{
  return new FormGroup({
      attach: new FormControl(false, [Validators.requiredTrue]),
      id_ram: new FormControl(this.istanza.id_ram),
      typeDocument: new FormControl(this.type.id),
      userUpload: new FormControl(this.userMe.email),
      filenameUpload: new FormControl(null),
  })
  }
  selectFile(event: any): void {
      this.fileAttach = event.target.files[0];
      this.fileName = this.fileAttach.name;

      if(this.fileAttach.type === 'application/pdf' || this.fileAttach.type === 'application/pkcs7-mime' || this.fileAttach.type === 'application/x-pkcs7-mime'){
          this.typeFileControl = true;
      }let limit = this.userMe.role === 'user'?4194304:10194304
      if(this.fileAttach.size < limit){
          this.fileDimControl = true;
      }
      if(this.fileDimControl && this.typeFileControl){
          this.form.controls.attach.setValue(true)
      }else{
          this.form.controls.attach.setValue(false)
      }

      this.form.controls.filenameUpload.setValue(this.fileAttach.name)
      //console.log(this.fileAttach)
  }
  deleteFile(): void{
      this.fileAttach = null;
      this.fileName = '';
      this.form.controls.filenameUpload.setValue(null)
      this.form.controls.attach.setValue(false)
      this.fileDimControl = this.typeFileControl= false;
  }
  changeType(event, type: TypeDocument): void{


     // this.type = null;
      if(event.isUserInput){
          this.visibleForm = false;
          this.form = null;
          this.fields = [];
          this.listOfPlaceholder =[];
          this.type = type;
          this.fields = this.type.fields;
          this.form =new FormGroup({});
          this.fileDimControl =false;
          this.typeFileControl = false;
          this.initializeForCreate();
          this.visibleForm = true;
      }

  }

}
