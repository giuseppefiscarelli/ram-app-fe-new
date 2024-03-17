import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ApplicationState } from '@app/app.state';
import { ConfigService } from '@app/modules/features/config/config.service';
import { ReportService } from '@app/modules/features/config/report.service';
import { Allegato } from '@app/modules/models/allegato.model';
import { Istanza } from '@app/modules/models/istanza.model';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { TypeReport } from '@app/modules/models/typeReport.model';
import { User } from '@app/modules/models/user.model';
import { Store, select } from '@ngrx/store';
import { Observable, switchMap, take, map } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';
import moment from 'moment';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { TYPE } from '@app/modules/notifications/values.constants';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { statusAdminVei } from '@app/app.costants';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { Report } from '@app/modules/models/report.model';

@Component({
  selector: 'app-admin-report-edit',
  templateUrl: './admin-report-edit.component.html',
  styleUrls: ['./admin-report-edit.component.scss'],
  providers:[ReportService,ConfigService]
})
export class AdminReportEditComponent implements OnInit {
  user: Observable<User>;
  userMe: User;
  istanza: Istanza;
  dialogTitle: string;
   btnSubmit: string;
   btnClose: string;
   mode:string;
   typeReport:TypeReport;
   form: FormGroup;
   preview: any;
   typeInstance: TypeIstance;

   alleDich: Allegato[] = [];
   alleVei:  Allegato[] = [];
   listaAllegatiVeicolo : Allegato[] = [];
   veicoli: Veicolo[] = [];
   rejectedVeicoli: Veicolo[]= [];
   typesDocument: TypeDocument[] = [];
   record:Report;
   fileName = '';
   fileAttach: File;
   typeFileControl:boolean = false;
   fileDimControl: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<ApplicationState>,
    private reportService: ReportService,
    private dialogRef: MatDialogRef<AdminReportEditComponent>,
    private service: ConfigService,
    private notifications: NotificationsComponent,

  ) {
    console.log(data)

    this.typeInstance = data.typeInstance;
    this.alleDich = data.listaAllegatiDich.filter(x=> x.adminState === 'rejected');
    this.alleVei = data.listaAllegatiVeicoli.filter(x=> x.adminState === 'rejected');
    this.veicoli = data.veicoli;
    this.typesDocument = data.typesDocuments;
    this.listaAllegatiVeicolo = data.listaAllegatiVeicoli;
    console.log(this.listaAllegatiVeicolo)
    this.rejectedVeicoli = this.veicoli.filter(x=> x.adminState === statusAdminVei.rejected)
  //  console.log(this.alleDich, this.alleVei);
    this.mode = data.mode;
    this.typeReport = data.typeReport;
    this.user = this.store.pipe(select('authentication'), select('user'));

    this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
    if(this.mode === 'generate'){

      this.istanza = data.istanza;
      this.dialogTitle = 'Inserimento nuovo report - '+ this.typeReport.description;
      this.btnSubmit= 'Crea Report';
      this.form =this.initializeForCreate()
      this.form.patchValue({
        ragSociale:this.istanza.ragione_sociale,
        indirizzo:this.istanza.indirizzo_impr,
        numCivico:this.istanza.civico_impr,
        cap:this.istanza.cap_impr,
        citta:this.istanza.comune_impr,
        prov:this.istanza.prov_impr,
        pecImpresa:this.istanza.pec_impr,
        idRam:this.istanza.id_ram,
        dataIdRam:this.istanza.data_invio,
        year:this.typeReport['typeistance']['year'],
      })
      if(this.typeReport.type === 'ammissione'){
        this.typeInstance.typeVei.map(
          (vei) => {
            let campo = vei['campoDb']

            let veicoli = this.veicoli.filter(x=> x.type === campo && x.adminState === statusAdminVei.accepted)
            console.log(campo,veicoli)
            if(veicoli.length>0){
              veicoli.map((x) => {
                let totaleArt = 0;
                if(vei['artDm'] === '2A'){
                  let formArt = this.form.controls['artAa'] as FormGroup;

                  console.log(formArt.controls['numero']);
                  console.log(formArt.controls['importo']);
                  console.log(formArt.controls['maggiorazioni']);
                  console.log(formArt.controls['totale']);


                }else if(vei['artDm'] === '2B'){
                  let formArt = this.form.controls['artAb'] as FormGroup;

                }else if(vei['artDm'] === '2C'){
                  let formArt = this.form.controls['artAc'] as FormGroup;

                }else if(vei['artDm'] === '3'){

                }else if(vei['artDm'] === '4'){

                }else if(vei['artDm'] === '5A'){

                }else if(vei['artDm'] === '5B'){

                }else if(vei['artDm'] === '5B'){

                }

              })







            }
          }
        )
      }
    }else if(this.mode === 'prepare'){
      this.record = data.report;
      this.istanza = data.istanza;
      this.typeReport = data.report.typeReport;
      this.dialogTitle = 'Anteprima Pec - '+ this.record.typeReport['description'];
      this.btnSubmit= 'Convalida pec per l\'invio';
      this.form = this.initializeForGenerate(this.record)

    }else if(this.mode === 'edit'){
      this.record = data.report;
     // this.form =this.initializeForEdit(this.record)
      let detail = JSON.parse(data.report.detail)
      console.log(detail);
      let test = detail.map(x=> x|| "")
      console.log(test)
      this.istanza = data.istanza;
      this.typeReport = data.report.typeReport;
      this.form = this.initializeForEdit(this.record,test )

      this.dialogTitle = 'Aggiornamento Documento - '+ this.record.typeReport['description'];
      this.btnSubmit= 'Aggiorna Documento';
    }



   }

  ngOnInit(): void {
  }
  initializeForCreate(): FormGroup{
    return new FormGroup({
        numProt : new FormControl(null),
        dataProt: new FormControl(null),
        dataVerbale:new FormControl(null),
        ragSociale:new FormControl(null),
        indirizzo:new FormControl(null),
        numCivico:new FormControl(null),
        cap:new FormControl(null),
        citta:new FormControl(null),
        prov:new FormControl(null),
        pecImpresa:new FormControl(null),
        idRam:new FormControl(null),
        dataIdRam:new FormControl(null),
        year:new FormControl(null),
        detail: new FormArray([]),
        artAa: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),

        artAb: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artAc: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artAd: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artB1: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artB2: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artCa: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),

        artCb: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artCc: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artD: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        totaleMaggiorazioni:new FormControl(null),
        totaleContributo:new FormControl(null),
        protPreavvisoRigetto:new FormControl(null),
        dataPreavvisoRigetto:new FormControl(null),
        dataNotaInammissibilita:new FormControl(null),
        motivazioneInammissibilita:new FormControl(null),

      }
    )
  }
  initializeForGenerate(data:Report): FormGroup{

    let subject = 'D.M. 18 novembre 2021 n. 461 - Comunicazioni Pratica ES '+this.istanza.id_ram+'/'+this.typeInstance.year;
    console.log(subject)
    let body = `
    Spett.Le ${data.ragSociale}, \n
    Si prega di leggere il documento allegato alla email. \n
    Cordiali Saluti. \n
    \n
    RAM - Logistica, Infrastruttura e Trasporti S.p.a.
    `
    return new FormGroup({
        body : new FormControl(body),
        subject: new FormControl(subject),
        id:new FormControl(data.id),
        filenameUpload : new FormControl(null),
        attachControl: new FormControl(false, [Validators.requiredTrue]),
      }
    )
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
        this.form.controls.attachControl.setValue(true)
    }else{
        this.form.controls.attachControl.setValue(false)
    }

    this.form.controls.filenameUpload.setValue(this.fileAttach.name)
    //console.log(this.fileAttach)
  }
  deleteFile(): void{
      this.fileAttach = null;
      this.fileName = '';
      this.form.controls.filenameUpload.setValue(null)
      this.form.controls.attachControl.setValue(false)
      this.fileDimControl = this.typeFileControl= false;
  }
  initializeForEdit(data:Report,detail?): FormGroup{
    console.log(detail)
    console.log(data)
   let detailArray: any[];

    if (detail && detail.length > 0) {
      // Costruisci un FormArray con i valori di detail
      detailArray = detail.map(text => new FormControl(text));
    } else {
      // Se detail non è definito o vuoto, inizializza un FormArray vuoto
      detailArray =  [];
    }
    return new FormGroup(
      {
        id: new FormControl(data.id),
        numProt : new FormControl(data.numProt),
        dataProt: new FormControl(data.dataProt),
        dataVerbale:new FormControl(data.dataVerbale?moment(Number(data.dataVerbale)).toISOString():null),
        ragSociale:new FormControl(data.ragSociale),
        indirizzo:new FormControl(data.indirizzo),
        numCivico:new FormControl(data.numCivico),
        cap:new FormControl(data.cap),
        citta:new FormControl(data.citta),
        prov:new FormControl(data.prov),
        pecImpresa:new FormControl(data.pecImpresa),
        idRam:new FormControl(data.idRam),
        dataIdRam:new FormControl(data.dataIdRam?moment(Number(data.dataIdRam)).toISOString():null),
        year:new FormControl(data.year),
        detail: new FormArray(detailArray),
        artAa: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),

        artAb: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artAc: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artAd: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artB1: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artB2: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artCa: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),

        artCb: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artCc: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artD: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        totaleMaggiorazioni:new FormControl(null),
        totaleContributo:new FormControl(null),
        protPreavvisoRigetto:new FormControl(null),
        dataPreavvisoRigetto:new FormControl(null),
        dataNotaInammissibilita:new FormControl(null),
        motivazioneInammissibilita:new FormControl(null),

      }
    )
  }
  get myArrayControls() {
    return (this.form.get('detail') as FormArray).controls;
  }

  addControl() {
    const control = new FormControl('');
    (this.form.get('detail') as FormArray).push(control);
  }

  removeControl(index: number) {
    (this.form.get('detail') as FormArray).removeAt(index);
  }

  getAlleDichDescription(type){
    let certType = this.typeInstance.certAttach.find(x=> x['description'] === type)

    //console.log(certType)

    return certType['longDescription']
  }

  getTypeDucument(idType){
   // console.log(idType)
    return this.typesDocument.find(x=>x.id == idType)
  }
  getVeicolo(idVeicolo){
    return this.veicoli.find(x=> x.id  === idVeicolo)
  }

  async onSubmitBtn(){
    Object
    .keys(this.form.controls)
    .map((key: string) => this.form.get(key))
    .forEach((control: AbstractControl) => {
        control.markAsDirty();
        control.markAsTouched();
    });


    let payload = this.form.getRawValue();
    console.log(payload);
    if(this.mode ==='generate'){

      const data =  await this.reportService.generateReport( this.typeReport.type,payload, this.veicoli, this.listaAllegatiVeicolo,this.typeInstance , this.istanza);
      //console.log(data)
      data.getBlob((blob) => {
        //console.log(blob)
        blob.filename = `${payload.idRam}_${this.typeReport.type}_${new Date().getTime()}.pdf`;
        this.reportService.uploadAllegatoFile(blob).pipe(
          switchMap((res: any) => {
            const filenameS: string = res.file[0].fd.substring(res.file[0].fd.lastIndexOf('/') + 1);
            payload.filenameStorage = filenameS;
            payload.fd = {
                fd:  res.file[0].fd,
                filename: res.file[0].filename,
                type: res.file[0].type,
                filenameStorage: filenameS
            }
            payload.userUpload = payload.userCreate =  this.userMe.id;
            payload.status = 'generated';
            payload.enable = true;
            payload.dataUpload = new Date().getTime();
            payload.typeReport = this.typeReport.id;
            payload.dataIdRam = moment(payload.dataIdRam).format('x');
            payload.detail = JSON.stringify(payload.detail);
            payload.dataVerbale =payload.dataVerbale ? moment(payload.dataVerbale).format('x'):null
            console.log(payload.detail)
            return this.service.createReport(payload);
          })
        ).subscribe({
          next: (res) => {
            this.notifications.toast(
              TYPE.SUCCESS,
                'Operazione Completata','Documento Inserito con Successo'
            )
            this.dialogRef.close(res)

          }
        });





      });

      // this.service.createReport(payload).subscribe({
      //   next:(res)=>{
      //     //console.log(res)
      //   }
      // })
    }else if(this.mode === 'edit'){
      const data =  await this.reportService.generateReport( this.typeReport.type,payload, this.veicoli, this.alleVei,this.typeInstance , this.istanza);
      //console.log(data)
      data.getBlob((blob) => {
        //console.log(blob)
        blob.filename = `${payload.idRam}_${this.typeReport.type}_${new Date().getTime()}.pdf`;
        this.reportService.uploadAllegatoFile(blob).pipe(
          switchMap((res: any) => {
            const filenameS: string = res.file[0].fd.substring(res.file[0].fd.lastIndexOf('/') + 1);
            payload.filenameStorage = filenameS;
            payload.fd = {
                fd:  res.file[0].fd,
                filename: res.file[0].filename,
                type: res.file[0].type,
                filenameStorage: filenameS
            }
            payload.userUpload = payload.userCreate =  this.userMe.id;
            payload.status = 'generated';
            payload.enable = true;
            payload.dataUpload = new Date().getTime();
            payload.typeReport = this.typeReport.id;
            payload.dataIdRam = moment(payload.dataIdRam).format('x');
            payload.detail = JSON.stringify(payload.detail);
            console.log(payload.detail)
            payload.dataVerbale =payload.dataVerbale ? moment(payload.dataVerbale).format('x'):null

            return this.service.updateReport(payload);
          })
        ).subscribe({
          next: (res) => {
            this.notifications.toast(
              TYPE.SUCCESS,
                'Operazione Completata','Documento Inserito con Successo'
            )
            this.dialogRef.close(res)

          }
        });





      });
    }else if(this.mode ==='prepare'){
      console.log(this.form.valid, this.fileAttach)

      // let filePayload : any= {...this.fileAttach, filename:this.fileAttach.name};
      // console.log(filePayload)
      this.reportService.uploadAllegato(this.fileAttach).pipe(
        switchMap((res: any) => {
          const filenameS: string = res.file[0].fd.substring(res.file[0].fd.lastIndexOf('/') + 1);
          payload.filenameStorage = filenameS;
          payload.fd = {
              fd:  res.file[0].fd,
              filename: res.file[0].filename,
              type: res.file[0].type,
              filenameStorage: filenameS
          }
          payload.userUpload =  this.userMe.id;
          payload.status = 'prepared';
          payload.statusInvio = 'pending';
          payload.enable = true;
          payload.dataUpload = new Date().getTime();
          payload.dataVerbale =payload.dataVerbale ? moment(payload.dataVerbale).format('x'):null

          console.log(payload)
          return this.service.updateReport(payload);
        })
      ).subscribe({
        next: (res) => {
          this.notifications.toast(
            TYPE.SUCCESS,
              'Operazione Completata','Documento Inserito con Successo'
          )
          this.dialogRef.close(res)

        }
      });




    }
  }
  async previewDoc(){

    const dataDoc = this.form.getRawValue();

    const data =  await this.reportService.generateReport( this.typeReport.type,dataDoc, this.veicoli, this.listaAllegatiVeicolo,this.typeInstance , this.istanza);
    data.getDataUrl((dataUrl) => {

      this.preview = dataUrl;
    })
  }

}
