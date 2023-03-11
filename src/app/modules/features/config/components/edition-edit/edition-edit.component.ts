import { TypeIstance } from '@app/modules/models/type-istance.model';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { Subscription } from 'rxjs';
import { ConfigIstance } from './../../../../models/config-istance.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../config.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ModalCategoryComponent } from '../modal-category/modal-category.component';
import { ModalCertComponent } from '../modal-cert/modal-cert.component';
import { ModalVeicoloComponent } from '../modal-veicolo/modal-veicolo.component';
import { TYPE } from '@app/modules/notifications/values.constants';
import { DateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it'
registerLocaleData(localeIt, 'it');
@Component({
  selector: 'app-edition-edit',
  templateUrl: './edition-edit.component.html',
  styleUrls: ['./edition-edit.component.scss']
})
export class EditionEditComponent implements OnInit {
    mode: string;
    value: any;
    form: FormGroup;
    formCertAtt: FormGroup;

    formTypeVei: FormGroup;
    formTypeDocVei: FormGroup;
    formTypeDocField: FormGroup;

    record: ConfigIstance;
    typeDocuments: TypeDocument[];
    value$: Subscription;

    certArt: {
        id?:number;
        description: string;
        longDescription: string;
        upload: string;
        adminControl:string;
        adminNote: string;


    }[];

    catVei:{
        id?:number;
        category: string;
        description: string;
    }[];
    typeVei:{
        id?:number;
        catVei: number;
        description: string;
        longDescription: string;
        artDm: string;
        campoDb: string
        typeDocument:[];
    }[];

    typeVeiGroupVIew:[];
    btnSubmit: string;
    constructor(
      private changeDetectorRef: ChangeDetectorRef,
      private services: ConfigService,
      private notifications:NotificationsComponent,
      private route: ActivatedRoute,
      private router: Router,
      private dialog: MatDialog,
      private dateAdapter: DateAdapter<any>,
    ) {
      this.dateAdapter.setLocale('it-IT');


      this.mode = this.route.snapshot.data.mode;
      this.typeDocuments =this.route.snapshot.data.typedoc;
      if(this.mode === 'create'){
        this.btnSubmit = 'Salva';
        this.certArt =[];
        this.catVei = [];
        this.typeVei = [];
        this.typeVeiGroupVIew =[];

        this.form = this.initializeForCreate()

    }
    if(this.mode==='edit'){
     //   console.log(this.typeDocuments)
        this.btnSubmit = 'Aggiorna';
        const data: TypeIstance = this.route.snapshot.data.record
        console.log(data)
        this.form = this.initializeForEdit(data)
        this.certArt =data.certAttach;
        this.catVei = data.categoryVei;
        this.typeVei = data.typeVei;
        this.typeVeiGroupVIew = this.groupByKey(this.typeVei,'catVei');
    }
    }

    ngOnInit() {
    }
    private initializeForCreate(): FormGroup {
      const now = new Date()
      now.setHours(10,0,0,0)
     // console.log(now.toString)
     // console.log(moment())
      return new FormGroup({
          year: new FormControl(null, [Validators.required, Validators.maxLength(4)]),
          description: new FormControl(null, [Validators.required]),

          sendStartDate: new FormControl(new Date(now)),
          sendEndDate: new FormControl(new Date(now), [Validators.required]),
          reportingStartDate: new FormControl(new Date(now), [Validators.required]),
          reportingEndDate: new FormControl(new Date(now), [Validators.required]),
      })
    }
    private initializeForEdit(data: TypeIstance): FormGroup {

      const now = new Date()
      now.setHours(10,0,0,0)

      return new FormGroup({
          id: new FormControl(data.id),
          year: new FormControl(data.year, [Validators.required, Validators.maxLength(4)]),
          description: new FormControl(data.description, [Validators.required]),

          sendStartDate: new FormControl(new Date(Number(data.sendStartDate))),
          sendEndDate: new FormControl(new Date(Number(data.sendEndDate)), [Validators.required]),
          reportingStartDate: new FormControl(new Date(Number(data.reportingStartDate)), [Validators.required]),
          reportingEndDate: new FormControl(new Date(Number(data.reportingEndDate)), [Validators.required]),
      })
    }



    getTypeDocument(type): string{
        const data = this.typeDocuments.find(x=> x.id == type)
        return data? data.description:''
    }
    onClickSubmit(): void{

      Object
      .keys(this.form.controls)
      .map((key: string) => this.form.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });
      console.log(this.form)
      if(this.form.valid){
          const payload = this.form.value;
          payload.certAttach = this.certArt;
          payload.categoryVei = this.catVei;
          payload.typeVei = this.typeVei;

          payload.expireDate = new Date(payload.expireDate).getTime();
          payload.sendStartDate = new Date(payload.sendStartDate).getTime();
          payload.sendEndDate = new Date(payload.sendEndDate).getTime();
          payload.reportingEndDate = new Date(payload.reportingEndDate).getTime();
          payload.reportingStartDate = new Date(payload.reportingStartDate).getTime();

          console.log(payload);
          if(this.mode === 'create'){
              this.services.createTypeInstance(payload).subscribe(
                  (res: TypeIstance) => {
                      console.log(res);
                      this.notifications.toast(
                        TYPE.SUCCESS,
                        'Operazione Completata',
                        'Edizione inserita con successo'
                      );
                  },
                  (err) =>console.log(err)
              )
          }
          if(this.mode === 'edit'){
              this.services.updateTypeInstance(payload).subscribe(
                  (res: TypeIstance) => {
                      console.log(res);
                      this.notifications.toast(
                        TYPE.SUCCESS,
                        'Operazione Completata',
                        'Edizione aggirnata con successo'
                      );
                  },
                  (err) =>console.log(err)
              )
          }


      }



  }

  onClickAttInstance(mode, attInstance?, atIndex?): void{
      let data ={}

      if(mode === 'create'){
          data={mode}
          const ref: MatDialogRef<ModalCertComponent> = this.dialog.open(ModalCertComponent,{
              panelClass: 'dialog-responsive',
              disableClose: true,
              width:'60%',
              data
          })
          ref.afterClosed().subscribe(
              (res) => {
                  if(!!res){

                       this.notifications.toast(
                        TYPE.SUCCESS,
                        'Operazione Completata',
                        'Tipo Allegato / certificazione inserito correttamente'
                    );
                      const updatedRecords = [...this.certArt].concat([res]);
                      this.certArt = [...updatedRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }

      if(mode ==='edit'){
          data={
              mode,
              attInstance,
          }
          const ref: MatDialogRef<ModalCertComponent> = this.dialog.open(ModalCertComponent,{
              panelClass: 'dialog-responsive',
              disableClose: true,
              width:'60%',
              data
          })
          ref.afterClosed().subscribe(
              (res) => {
                  if(!!res){

                       this.notifications.toast(
                        TYPE.SUCCESS,
                        'Operazione Completata',
                        'Tipo Allegato / certificazione aggiornato correttamente'
                  );
                      const currentRecords = [...this.certArt];
                      currentRecords[atIndex] = res;
                      this.certArt = [...currentRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }
      if(mode === 'delete'){
          Swal.fire({
              title: 'Attenzione!',
              text: 'Vuoi eliminare il record?',
              icon: 'warning',
              footer: 'L\'operazione è irreversibile',
              showCancelButton: true,
              allowOutsideClick: false
            }).then( (res) => {
                  if (res && res.value){
                      this.certArt = this.certArt.filter((record,index) => index !== atIndex);
                      this.changeDetectorRef.markForCheck();
                  }
            });
      }
  }

  onClickCatVei(mode, catVei?, atIndex?): void {
      let data = {}
      if(mode === 'create'){
          data={mode}
          const ref: MatDialogRef<ModalCategoryComponent> = this.dialog.open(ModalCategoryComponent,{
              panelClass: 'dialog-responsive',
              disableClose: true,
              width:'60%',
              data
          })
          ref.afterClosed().subscribe(
              (res) => {
                  if(!!res){

                       this.notifications.toast(
                        TYPE.SUCCESS,
                        'Operazione Completata',
                        'Categoria inserita correttamente'
                      );
                      const updatedRecords = [...this.catVei].concat([res]);
                      this.catVei = [...updatedRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }
      if(mode ==='edit'){
          data={
              mode,
              catVei,
          }
          const ref: MatDialogRef<ModalCategoryComponent> = this.dialog.open(ModalCategoryComponent,{
              panelClass: 'dialog-responsive',
              disableClose: true,
              width:'60%',
              data
          })
          ref.afterClosed().subscribe(
              (res) => {
                  if(!!res){

                       this.notifications.toast(
                        TYPE.SUCCESS,
                        'Operazione Completata',
                        'Categoria aggiornata correttamente'
                      );
                      const currentRecords = [...this.catVei];
                      currentRecords[atIndex] = res;
                      this.catVei = [...currentRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }
      if(mode === 'delete'){
          Swal.fire({
              title: 'Attenzione!',
              text: 'Vuoi eliminare il record?',
              icon: 'warning',
              footer: 'L\'operazione è irreversibile',
              showCancelButton: true,
              allowOutsideClick: false
            }).then( (res) => {
                  if (res && res.value){
                      this.catVei = this.catVei.filter((record,index) => index !== atIndex);
                      this.changeDetectorRef.markForCheck();
                  }
            });
      }


  }
  onClickTypeVei(mode, typeVei?, atIndex?): void{


      if(mode === 'create'){
          const ref: MatDialogRef<ModalVeicoloComponent> = this.dialog.open(ModalVeicoloComponent,{
              panelClass: 'dialog-responsive',
              disableClose: true,
              width:'60%',
              data:{mode, catVei:this.catVei, typeDocuments: this.typeDocuments}
          })
          ref.afterClosed().subscribe(
              (res) => {
                  if(!!res){

                       this.notifications.toast(
                        TYPE.SUCCESS,
                        'Operazione Completata',
                        'Tipo Veicolo inserito correttamente'
                        );
                      const updatedRecords = [...this.typeVei].concat([res]);
                      this.typeVei = [...updatedRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }
      if(mode ==='edit'){

          const ref: MatDialogRef<ModalVeicoloComponent> = this.dialog.open(ModalVeicoloComponent,{
              panelClass: 'dialog-responsive',
              disableClose: true,
              width:'60%',
              data:{
                mode,
                typeVei,
                catVei:this.catVei,
                typeDocuments: this.typeDocuments
            }
          })
          ref.afterClosed().subscribe(
              (res) => {
                  if(!!res){


                       this.notifications.toast(
                        TYPE.SUCCESS,
                        'Operazione Completata',
                          'Tipo Veicolo inserito correttamente'
                        );
                      const currentRecords = [...this.typeVei];
                      currentRecords[atIndex] = res;
                      this.typeVei = [...currentRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }
      if(mode ==='delete'){
          Swal.fire({
              title: 'Attenzione!',
              text: 'Vuoi eliminare il record?',
              icon: 'warning',
              footer: 'L\'operazione è irreversibile',
              showCancelButton: true,
              allowOutsideClick: false
            }).then( (res) => {
                  if (res && res.value){
                      this.typeVei = this.typeVei.filter((record,index) => index !== atIndex);
                      this.changeDetectorRef.markForCheck();
                  }
            });
      }
      this.typeVeiGroupVIew = this.groupByKey(this.typeVei,'catVei');
      this.changeDetectorRef.markForCheck();

  }
  private groupByKey(array, key) {
      return array
        .reduce((hash, obj) => {
          if(obj[key] === undefined) return hash;
          return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
        }, {})
   }

}
