import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
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
import { Observable, switchMap, take } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';
import moment from 'moment';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { TYPE } from '@app/modules/notifications/values.constants';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { statusAdminVei } from '@app/app.costants';
import { TypeDocument } from '@app/modules/models/typeDocument.model';

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
   veicoli: Veicolo[] = [];
   rejectedVeicoli: Veicolo[]= [];
   typesDocument: TypeDocument[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<ApplicationState>,
    private reportService: ReportService,
    private dialogRef: MatDialogRef<AdminReportEditComponent>,
    private service: ConfigService,
    private notifications: NotificationsComponent,

  ) {
    //console.log(data)
    this.typeInstance = data.typeInstance;
    this.alleDich = data.listaAllegatiDich.filter(x=> x.adminState === 'rejected');
    this.alleVei = data.listaAllegatiVeicoli.filter(x=> x.adminState === 'rejected');
    this.veicoli = data.veicoli;
    this.typesDocument = data.typesDocuments;
    console.log(this.typeInstance)
    console.table(this.typeInstance.typeVei)
    this.rejectedVeicoli = this.veicoli.filter(x=> x.adminState === statusAdminVei.rejected)
  //  console.log(this.alleDich, this.alleVei);
    console.log(this.veicoli, this.rejectedVeicoli)
    this.mode = data.mode;
    this.typeReport = data.typeReport;
    //console.log(this.typeReport)
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

    }

    console.log(this.typeReport)
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

              }

            })







          }
        }
      )
    }

   }

  ngOnInit(): void {
  }
  initializeForCreate(): FormGroup{
    return new FormGroup(
      {
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
    //console.log(payload);
    if(this.mode ==='generate'){
      payload.details = JSON.stringify(payload.details);

      const data =  await this.reportService.generateReport( this.typeReport.type,payload);
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
            payload.dataIdRam = moment(payload.dataIdRam).format('x')
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
    }

  }
  async previewDoc(){

    const dataDoc = this.form.getRawValue();

    const data =  await this.reportService.generateReport( this.typeReport.type,dataDoc);
    data.getDataUrl((dataUrl) => {

      this.preview = dataUrl;
    })
  }

}
