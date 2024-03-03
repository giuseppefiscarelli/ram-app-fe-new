import { VeiIstruttoriaDialogComponent } from './../vei-istruttoria-dialog/vei-istruttoria-dialog.component';
import { ConfigService } from '@app/modules/features/config/config.service';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, take } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationState } from '@app/app.state';
import { select, Store } from '@ngrx/store';

import { TYPE } from '@app/modules/notifications/values.constants';
import { statusCheck } from '@app/app.costants';
import { Allegato } from '@app/modules/models/allegato.model';
import { Istanza, Rendicontazione } from '@app/modules/models/istanza.model';
import { IstanzaCheck } from '@app/modules/models/istanzacheck.model';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { User } from '@app/modules/models/user.model';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { IstanzeService } from '../../../istanze.service';
import { AdminDialogAllegatoComponent } from '../admin-dialog-allegato/admin-dialog-allegato.component';
import Swal from 'sweetalert2';
import { Report } from '@app/modules/models/report.model';
import moment from 'moment';


@Component({
  selector: 'app-admin-veicolo-dialog',
  templateUrl: './admin-veicolo-dialog.component.html',
  styleUrls: ['./admin-veicolo-dialog.component.scss'],
  providers:[ConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminVeicoloDialogComponent implements OnInit {


  user: Observable<User>;
  userMe: User;
  typeDocuments: TypeDocument[];
  allegatiVeicolo: Allegato[];
  veicolo: Veicolo;
  typeIstance: TypeIstance;
  istanzaCheck: IstanzaCheck;
  istanza: Istanza;
  displayedColumnsAllegato: string[] = [
      'tipo',
      'note',
      'stato',
      'noteAdmin',
      'action'];

      dialogTitle: string;
      dialogSubTitle: string;
      btnSubmit: string;
  form:FormGroup;
  formVeicolo:FormGroup;
  typeVeicolo:any;
  alleSelected: boolean;
  alleDataSelected: Allegato;
  isLoading:boolean;
  url: string;

  statusCheck:statusCheck;
  rendicontazione: Rendicontazione;

   filterOptionsDescriptors: {
    [key: string]: any
    };
    datiIstruttoriaShow:boolean=false;
    valoreContributo:number = 0;
    valoreMaggPmi: number = 0;
    valoreMaggRete: number = 0;
    dataIstruttoria: Report;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private services: IstanzeService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AdminVeicoloDialogComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private notifications: NotificationsComponent,
    private store: Store<ApplicationState>,
    private configService:ConfigService
    ) {


      this.user = this.store.pipe(select('authentication'),select('user'));
      this.user.pipe(take(1)).subscribe((userMe: User) => this.userMe = userMe);
      this.istanza = data.istanza;
      console.log(this.istanza)
      this.istanzaCheck = data.istanzaCheck;
      this.veicolo = data.veicolo;
      this.allegatiVeicolo = data.allegatiVeicolo;
      this.dialogSubTitle = data.info;
      this.typeDocuments = data.typeDocuments;
      this.typeIstance =data.typeIstance;
      this.dataIstruttoria = data.dataIstruttoria;
      this.rendicontazione = data.rendicontazione;
      this.dialogTitle = 'Scheda Veicolo';
      this.btnSubmit= 'Aggiorna informazioni e stato lavorazione';
      this.typeVeicolo = this.typeIstance.typeVei.find(x=> x['campoDb'] === this.veicolo.type);
      this.alleSelected = false;
      this.isLoading = true;
      this.alleDataSelected = null;
      this.dataIstruttoria = data.dataIstruttoria;
      this.rendicontazione = data.rendicontazione;
      this.formVeicolo = this.initializeForEditVeicolo(this.veicolo)

      console.log(this.checkAllegatiStatus(), this.allegatiVeicolo.length, 'prova')
   //console.log(this.allegatiVeicolo)
      const checkDichiarazioni = this.checkDichiarazioni();
      console.log(checkDichiarazioni,'cdich')

      if(checkDichiarazioni && (this.checkAllegatiStatus() === this.allegatiVeicolo.length)){
          this.datiIstruttoriaShow = true;
          let contributo  = this.services.calcolaContributo(this.istanza, this.istanzaCheck, this.veicolo, this.typeIstance)
          this.valoreContributo = contributo['valoreContributo'];
          this.valoreMaggPmi = contributo['magg_pmi'];
          this.valoreMaggRete = contributo['magg_rete'];

        console.log(this.valoreContributo,'valo contr')
        }
    //  console.log(this.valoreContributo)
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



    }

    ngOnInit(): void {

      this.formVeicolo.controls.adminState.valueChanges.subscribe(
        (val) => {
          console.log(val)
          if(val && (val ==='rejected' || val === 'pending')){
            const required = Validators.required
            //   this.formVeicolo.get('costoIstr').removeValidators(required)
            if(val === 'rejected'){
              this.formVeicolo.get('costoIstr').setValue('0')
              this.formVeicolo.get('valoreContributo').setValue('0')
              this.formVeicolo.get('costoIstr').disable()
              this.formVeicolo.get('valoreContributo').disable()

            }
            this.formVeicolo.get('costoIstr').clearValidators()
            this.formVeicolo.get('costoIstr').updateValueAndValidity()
            this.formVeicolo.get('valoreContributo').clearValidators()
            this.formVeicolo.get('valoreContributo').updateValueAndValidity()
            console.log(this.formVeicolo)
              // this.formVeicolo.controls.valoreContributo.removeValidators(required)
              //  console.log(this.formVeicolo)
          }else{
            this.formVeicolo.get('costoIstr').enable()
            this.formVeicolo.get('valoreContributo').enable()
            this.formVeicolo.get('costoIstr').setValidators([Validators.required])
            this.formVeicolo.get('valoreContributo').setValidators([Validators.required])
          }
       //   this.formVeicolo.clearValidators()
        //  this.formVeicolo.updateValueAndValidity()
          console.log(this.formVeicolo)
        }
      )
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

    initializeForEditVeicolo(v: Veicolo): FormGroup{
        return new FormGroup({
            id: new FormControl(v.id),
            adminState : new FormControl(v.adminState, [Validators.required]),
            adminNote : new FormControl(v.adminNote),
            adminDateUpdate : new FormControl(),
            adminUser : new FormControl(this.userMe.email),
            costoIstr : new FormControl(v.costoIstr, [Validators.required]),
            noteIstr : new FormControl(),
            valoreContributo : new FormControl(v.valoreContributo,[Validators.required]),
            pmiIstr : new FormControl(v.pmiIstr),
            reteIstr : new FormControl(v.reteIstr),

        })
    }

    getTypeDocument(id){

        return this.typeDocuments.find(x=> x.id == id).description
    }

    getTipoVeicolo(tipo){

        const data = this.typeIstance.typeVei.find(X => X['campoDb'] === tipo);
    // console.log(data)
        return data['description'];
    }

    onClickAlle(mode,data){
     //   console.log(mode,data)
        this.isLoading = true;
        this.alleDataSelected = null;
        if(mode === 'view'){
            this.alleSelected = true;
            //this.isLoading = true;
            const file = data.fd;
            this.form = this.initializeForEdit(data)
            this.services.getFile(file)
            .subscribe(
            {
                next: (res) => {
                    this.alleDataSelected = data;
                  //  console.log(res)
                 //   console.log(file)
                    const blob = new Blob([res],{type: file.type});
                    this.url = window.URL.createObjectURL(blob);
                 //   console.log(this.url)

                },
                complete:()=>{
                    this.isLoading = false;
                    this.changeDetectorRef.markForCheck()
                }
            }
            )
        }
    }

    onSubmitBtn(){
        Object
        .keys(this.formVeicolo.controls)
        .map((key: string) => this.formVeicolo.get(key))
        .forEach((control: AbstractControl) => {
            control.markAsDirty();
            control.markAsTouched();
        });

        if (this.formVeicolo.valid){
            const payload = this.formVeicolo.value;
        console.log(payload)
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || payload[key] === null ) {
                    delete payload[key];
                }
            });


            if((this.veicolo.amount !== payload.costoIstr) || (this.valoreContributo !== payload.valoreContributo)){
                Swal.fire({
                    title: 'Attenzione!',
                    text: 'I valori calcolati sono differenti da quelli accordati',
                    icon: 'warning',
                    cancelButtonText:'Torna Indietro',
                    confirmButtonText:'Prosegui',
                    showCancelButton: true,
                    allowOutsideClick: false
                }).then( (res) => {
                    if (res && res.value){
                      this.services.updateVeicolo(payload).subscribe(
                        {
                            next:(res: Veicolo) => this.veicolo = res,
                            complete:()=> {
                              this.changeDetectorRef.markForCheck();
                              this.notifications.toast(
                                TYPE.SUCCESS,
                                'Operazione Completata',
                                'Veicolo aggiornato con successo'
                            )}
                        }
                    )
                    console.log('aggiorna veicolo')
                    }
                })
            }else{
                this.services.updateVeicolo(payload).subscribe(
                    {
                        next:(res: Veicolo) => this.veicolo = res,
                        complete:()=> {
                            this.changeDetectorRef.markForCheck();
                            this.notifications.toast(
                              TYPE.SUCCESS,
                              'Operazione Completata',
                              'Veicolo aggiornato con successo'
                              )
                            }
                    }
                )
            }
        }
    }

    onClickSubmitAlle(){
        Object
        .keys(this.form.controls)
        .map((key: string) => this.form.get(key))
        .forEach((control: AbstractControl) => {
            control.markAsDirty();
            control.markAsTouched();
        });

        if (this.form.valid){
            const payload = this.form.value;
        // console.log(payload)
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || payload[key] === null ) {
                    delete payload[key];
                }
            });
            payload.adminDate = new Date().getTime().toString();
            payload.adminUser = this.userMe.id;
        // console.log(payload);
            this.services.updateAllegato(payload).subscribe(

                    (res: Allegato) => {
                        if(!!res){
                            this.notifications.toast(
                            TYPE.SUCCESS,
                                'Operazione Completata',
                                'Allegato veicolo aggiornato'
                            )
                            let updateItem = this.allegatiVeicolo.find(x=> x.id === res.id);
                            let index = this.allegatiVeicolo.indexOf(updateItem);
                            console.log(this.allegatiVeicolo)
                            const currentRecords = [...this.allegatiVeicolo];
                            currentRecords[index] = res;
                            this.allegatiVeicolo = [...currentRecords];
                            console.log(this.allegatiVeicolo)
                            this.alleSelected = null;
                          console.log(this.allegatiVeicolo)
                          console.log(this.checkDichiarazioni(), this.checkAllegatiStatus(), this.allegatiVeicolo.length)
                            if(this.checkDichiarazioni() && (this.checkAllegatiStatus() === this.allegatiVeicolo.length)){
                                this.datiIstruttoriaShow = true;
                                let contributo  = this.services.calcolaContributo(this.istanza, this.istanzaCheck, this.veicolo, this.typeIstance)
                                this.valoreContributo = contributo['valoreContributo'];
                                this.valoreMaggPmi = contributo['magg_pmi'];
                                this.valoreMaggRete = contributo['magg_rete'];

                                console.log(this.valoreContributo,'valore contributo')

                                //  this.formVeicolo.controls.valoreContributo.setValue(contributo)
                            }else{
                                this.datiIstruttoriaShow = false;
                                let payVei = this.veicolo;
                                payVei.adminState = 'pending';
                                this.services.updateVeicolo(payVei).subscribe(
                                (res) => {
                                    this.veicolo = res;

                                }
                                )
                            }
                            this.changeDetectorRef.markForCheck();
                        }
                    },
                    (error) => {
                        this.notifications.toast(
                        TYPE.ERROR,
                            'Errore',
                            'Allegato non aggiornato'
                        )
                    }

            )
        }
    }

    onClickCloseDialog(){

        const dataReturn = {
            veicolo:this.veicolo,
            allegati:this.allegatiVeicolo
        }
        this.dialogRef.close(dataReturn)
    }

    viewAllegato(file): void{
    //  console.log(file)
   //   window.open('www.google.it');
   //   console.log( this.alleDataSelected)

      window.open(this.url)

        // this.services.getFile(file)
        // .subscribe(
        //     (res) => {
        //         const blob = new Blob([res],{type: file.type});
        //         const url = window.URL.createObjectURL(blob);
        //     window.open(url);

        //     },
        //         error => console.log('Error downloading the file.')
        //     );


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

    checkAllegatiStatus(){
        const count = this.allegatiVeicolo.filter(x=> (x.adminState ==='accepted' ||  x.adminState ==='rejected') && x.enable).length

        return count
    }

    checkDichiarazioni(){
        const checkDichiarazioni = this.istanzaCheck.contratto === 'accepted' &&
        this.istanzaCheck.delega === 'accepted' &&
        //this.istanzaCheck.dimImpresa &&
        this.istanzaCheck.doc === 'accepted' &&
        this.istanzaCheck.firma === 'accepted' &&
        this.istanzaCheck.pec === 'accepted' ? true: false;
        console.log(checkDichiarazioni)
        console.log(this.istanzaCheck)
        return checkDichiarazioni;
    }

    onClickDatiIstruttoria(){
        const veicolo = this.veicolo;
        const ref: MatDialogRef<VeiIstruttoriaDialogComponent> = this.dialog.open(
            VeiIstruttoriaDialogComponent,
            { hasBackdrop: true,
                data:{
                    veicolo: veicolo
                }
            }

        )
    }

    checkAllegatoIntegrazione(allegato: Allegato){
      console.log(allegato)
      let dataUpload = moment(Number(allegato.dataUpload))
      console.log(this.rendicontazione.dateEnd)

      if(dataUpload.isAfter(moment(Number(this.rendicontazione.dateEnd)))){
        if(this.dataIstruttoria.typeReport['type'] === 'integrazione'){
          return 'Documento Integrazione'
        }
      }
      return false

    }

}
