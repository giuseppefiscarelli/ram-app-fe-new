import { statusAdminVei } from './../../../../../../app.costants';
import { DateAdapter } from '@angular/material/core';
import { ReportsEditComponent } from './../../../../config/components/report/reports-edit/reports-edit.component';
import { CheckCertDialogComponent } from './../check-cert-dialog/check-cert-dialog.component';
import { AdminVeicoloDialogComponent } from './../admin-veicolo-dialog/admin-veicolo-dialog.component';
import Swal from 'sweetalert2';
import { AdminDialogAllegatoComponent } from './../admin-dialog-allegato/admin-dialog-allegato.component';
import { ConfigService } from '@app/modules/features/config/config.service';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApplicationState } from '@app/app.state';
import { Allegato } from '@app/modules/models/allegato.model';
import { Istanza, Rendicontazione } from '@app/modules/models/istanza.model';
import { IstanzaCheck } from '@app/modules/models/istanzacheck.model';
import { Report } from '@app/modules/models/report.model';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { TypeReport } from '@app/modules/models/typeReport.model';
import { User } from '@app/modules/models/user.model';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { Store } from '@ngrx/store';
import { debounceTime, forkJoin, Observable, Subscription } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';


import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it'
import { FormControl, FormGroup } from '@angular/forms';
registerLocaleData(localeIt, 'it');
@Component({
  selector: 'app-admin-istanza-page',
  templateUrl: './admin-istanza-page.component.html',
  styleUrls: ['./admin-istanza-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[ConfigService],
})
export class AdminIstanzaPageComponent implements OnInit, OnDestroy {
  user: Observable<User>;
  userMe: User;
  mode: string;
  istanza: Istanza;
  rendicontazione: Rendicontazione;
  istanzaCheck :IstanzaCheck;

  listaVeicoli: Veicolo[];
  listaVeicoliFiltered: Veicolo[];
  listaAllegati: Allegato[];
  listaAllegatiVeicoli: Allegato[];
  listaAllegatiDich: Allegato[];
  typeDocuments: TypeDocument[];
  typeReport: TypeReport[];
  reports: Report[];
  typeIstance: TypeIstance;

  data$: Subscription;
  displayedColumns: string[] = ['progressivo','categoria', 'tipoVeicolo',  'dativeicolo', 'acquisizione','stato','action'];



  certAttach: any[];
  certControlStatus: any[];

  rottamazione: boolean;

  certEnable:any[];
  totCertEnable: number;

  statoIstruttoria:string;
  funzioniIstruttoria: boolean;

  alleTotal=0;
  allePending=0;
  alleAccepted=0;
  alleRejecetd=0;



  filtersVei: FormGroup;
  filtersVei$: Subscription;
  filterVeiOptionsDescriptors: {
    [key: string]: any
  };


    constructor(private route: ActivatedRoute,
                private service: IstanzeService,
                private dialog: MatDialog,
                private dateAdapter: DateAdapter<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private store: Store<ApplicationState>,
                private notifications: NotificationsComponent,
                private configService:ConfigService
                ) {
                  this.dateAdapter.setLocale('it-IT');
                  this.istanza = this.route.snapshot.data.istanza;
                  this.rendicontazione = this.route.snapshot.data.rendicontazione;
                  this.istanzaCheck = this.route.snapshot.data.istanzaCheck;
                  this.rottamazione = (this.istanza.rim_rott_1 || this.istanza.rim_rott_2 || this.istanza.r_rott_1 || this.istanza.r_rott_2 || this.istanza.r_rott_3)?true:false;
                  this.totCertEnable = 0;
                  this.certEnable = [];
                  this.certAttach = [];
                  this.certControlStatus = [];
                  this.listaAllegatiDich = [];
                  this.listaAllegati = [];
                  this.listaVeicoli = this.listaVeicoliFiltered = [];
                  this.typeReport = [];
                  this.reports = [];
                  this.statoIstruttoria = 'disabled';
                  this.funzioniIstruttoria = false;
                  this.typeIstance = null;

                  this.filtersVei = new FormGroup({
                    category: new FormControl(null),
                    type: new FormControl(null),
                    licensePlate: new FormControl(null),
                    adminState: new FormControl(null)

                });
                this.filterVeiOptionsDescriptors = {
                  adminState: [
                      {title: 'all', value: null}
                  ]
              };
                Object.keys(statusAdminVei)
                .map((status: string) => (
                    this.filterVeiOptionsDescriptors.adminState.push(
                        {
                            title: statusAdminVei[status],
                            value: statusAdminVei[status]
                        }
                    )
                ));



                  this.data$ = forkJoin([
                    this.service.fetchVeicoli({drop:true, id_ram: this.istanza.id_ram}),
                    this.service.fetchAllegati({drop:true,id_ram: this.istanza.id_ram, enable:true}),
                    this.service.getTypeInstance(this.istanza.tipo_istanza),
                    this.configService.fetchTypeDocuments({drop:true}),
                    this.configService.fetchTypeReport({drop:true}),
                    this.configService.fetchReport({drop:true, enable:true, id_ram:this.istanza.id_ram})
                ]).subscribe(([vei, alle,ista,typeDocument, typeReport, reports]) =>{

                    this.listaVeicoli= this.listaVeicoliFiltered = vei;
                    this.listaAllegati=alle;

                    this.typeIstance = ista;
                    console.log(ista, vei)
                    this.typeDocuments = typeDocument;
                    this.typeReport = typeReport;
                    this.reports = reports;
                 //   this.getCertificazioni();
                    this.initializeAllegati(this.typeIstance);
                    this.getStatoIstruttoria();
                    this.getIndicatorData()
                  /*   console.log(vei, alle,ista) */
                  this.createVeiObservable()
                  this.changeDetectorRef.markForCheck()

                })
                 }

    ngOnInit() {
    }
    ngOnDestroy(): void {
        this.filtersVei$.unsubscribe();
    }
    createVeiObservable(){

      this.filtersVei$ = this.filtersVei.valueChanges
      .pipe(debounceTime(400))
      .subscribe(
          (value: { [key: string]: string }) => {
              const filters = {};
             // this.totRecord = 0;
              Object.keys(value)
                  .forEach((key: string) => {

                    if (value[key] === undefined || value[key] === ''|| value[key] === null ) {
                      delete filters[key] ;
                    }else{
                      filters[key] = value[key]
                    }
                 //   console.log(value, key)


                  });
                  this.listaVeicoliFiltered = this.listaVeicoli;

                  if(filters['category']){
                    this.listaVeicoliFiltered = this.listaVeicoliFiltered.filter(x=> x['category'] === filters['category'])
                  }

                  if(filters['type']){
                    this.listaVeicoliFiltered = this.listaVeicoliFiltered.filter(x=> x['type'] === filters['type'])
                  }
                  if(filters['licensePlate']){
                    this.listaVeicoliFiltered = this.listaVeicoliFiltered.filter(x=> x['licensePlate'] === filters['licensePlate'])
                  }
                  if(filters['adminState']){
                    this.listaVeicoliFiltered = this.listaVeicoliFiltered.filter(x=> x['adminState'] === filters['adminState'])
                  }
                 // console.log(filters, this.listaVeicoliFiltered)


                 // this.listaVeicoli=vei;
             // this.dataSource = [];
             // this.paginator.resetFilters(filters);
            //  const payloadCount = filters;
            //  delete payloadCount['list'];
           //   payloadCount['total'] = 'true';
           this.changeDetectorRef.markForCheck()
            //  this.changeDetectorRef.markForCheck();

          }
      );
    }

  getCertificazioni(){
    // console.log(this.typeIstance.certAttach)
     const type = this.typeIstance.certAttach;

     type.map(
         (t) => {
             const description = t['description'];
             let campoDb = t['description'];
             let check = this.istanza[campoDb]??null;
             if(t['upload'] === true){


                 if(check === 'Yes' || (campoDb === 'pmi' && (this.istanza.tipo_impresa === '1' || this.istanza.tipo_impresa === '2'))|| ((this.istanza.rim_nv_1 > 0 || this.istanza.rim_nv_2 > 0) && campoDb === 'ampl')){
                     this.totCertEnable++;

                     this.certEnable.push({type:campoDb});
                 }
                 this.certAttach.push(t);

             }else{


             }
            /*  const status = this.typeIstance[description];
             console.log(status); */
         }
     )


   }
   getEnableReport(data){

     if(data.id === 1){
         const check = this.listaAllegati.filter(x=> x.adminState === 'rejected'&& x.enable === true).length > 0 ?false: true
         console.log(check)
         return check
     }
     if(data.id === 2){
         const check = this.listaAllegati.filter(x=> x.adminState === 'rejected'&& x.enable === true).length > 0 ?false: true
         console.log(check)
         return check
         return true
     }
     if(data.id === 3){
         const check = this.listaAllegati.filter(x=> x.adminState === 'accepted'&& x.enable === true).length > 0 ?false: true
         console.log(check)
         return check
         return true
     }
     if(data.id === 4){

         return true
     }
   }
   getCertificazioniData(type,mode?,typeResponse?){
    // console.log(type)
     switch (mode) {
         case 'cert':
           //  const typeData = this.typeIstance.certAttach.find(x=> x['description'] === type);
             const certData = this.istanzaCheck[type]??'toWork';

             const noteAdminData = this.istanzaCheck['note'+type[0].toUpperCase() + type.slice(1)]
          //  console.log(certData)
             return {status:certData, note:noteAdminData}


         case 'attach':
             const alleData = this.listaAllegatiDich.find(x=> x.typeDocument === type);

             let status = 'notFound';

             if(alleData){

                if(alleData.adminState){
                 status = alleData.adminState;
                }else{
                 status = 'fileUpload'
                }
             }
             const instanzaCheckData = {
                 note: this.istanzaCheck['note']
             }

         //    console.log(alleData)
             return  {status,data:alleData};

     }


   }

   getCertData(type){
     console.log(type);


   }

   initializeAllegati(typeIstance:TypeIstance){
     typeIstance.certAttach.map(
         (cert) => {
          //   console.log(cert)
             let campoDb = cert['description'];
             if(campoDb === 'ampl' && this.rottamazione){

             }
         //    console.log(campoDb)
             const cList = this.listaAllegati.filter(x=> x.typeDocument === campoDb )
             const upList = [...this.listaAllegatiDich.concat(cList)];
             this.listaAllegatiVeicoli = this.listaAllegati.filter(x=> x.typeDocument !== campoDb)
             this.listaAllegatiDich = [...upList];
             let check = this.istanza[campoDb]??null;
           //  console.log(check)
             if(check === 'Yes' || (campoDb === 'pmi' && (this.istanza.tipo_impresa === '1' || this.istanza.tipo_impresa === '2'))|| ((this.istanza.rim_nv_1 > 0 || this.istanza.rim_nv_2 > 0) && campoDb === 'ampl')){
                 this.totCertEnable++;

                 this.certEnable.push(cert);
             }
             if(!cert['upload']){
                 this.certControlStatus.push(cert)
             }
         }
     )
     this.changeDetectorRef.markForCheck();
   }

   viewAllegato(allegato): void{

     const file = allegato.fd;

     this.service.getFile(file)
     .subscribe(
         (res) => {
             const blob = new Blob([res],{type: file.type});
             const url = window.URL.createObjectURL(blob);

                  const ref : MatDialogRef<AdminDialogAllegatoComponent> = this.dialog.open(AdminDialogAllegatoComponent,{
                     panelClass: 'dialog-responsive',
                     //disableClose: true,
                     width:'90%',

                     maxWidth:'90%',
                     maxHeight:'90%',
                     data: {
                        url,
                        allegato,

                     }
                 })

                 ref.afterClosed().subscribe(
                     (res: Allegato)=>{
                         console.log(res)
                         if(!!res){
                             const currentRecordsA = [...this.listaAllegati];
                             const currentRecordsB = [...this.listaAllegatiDich];

                             currentRecordsA[this.listaAllegati.findIndex(x=> x.id === res.id)] = res;
                             currentRecordsB[this.listaAllegatiDich.findIndex(x=> x.id === res.id)] = res;
                             this.listaAllegati = [...currentRecordsA];
                             this.listaAllegatiDich = [...currentRecordsB];


                             if(res.typeDocument && res.typeDocument === 'pmi'){
                                 console.log(this.istanzaCheck);
                                 this.istanzaCheck.pmi = res.adminState



                             }
                             this.service.updateIstanzaCheck(this.istanzaCheck).subscribe(
                                 {
                                     next:(res: IstanzaCheck) => this.istanzaCheck = res,
                                    complete:()=> this.changeDetectorRef.markForCheck()

                                 }
                             )

                            /*  currentRecords[atIndex] = updatedUser;

                             this.records = [...currentRecords]; */
                         }
                     }
                 )
         },
             error => console.log('Error downloading the file.')
         );
   }

   getTipoVeicolo(tipo){

     const data = this.typeIstance.typeVei.find(X => X['campoDb'] === tipo);
    // console.log(data)
     return data['description'];
   }

   getStatoIstruttoria(){



     if(this.rendicontazione.status === 'closed' || this.rendicontazione.status === 'reporting'){
         this.statoIstruttoria = 'enabled';
         this.funzioniIstruttoria = true;

     }


   }

   onClickAllegato(mode, data?, atIndex?){
  //   console.log(mode, data)
     if(mode === 'edit'){

         this.viewAllegato(data)
     }
     if(mode === 'delete'){
         Swal.fire({
             title: 'Vuoi eliminare l\'allegato?',
             text: 'Non potrai più recuperarlo',
             icon: 'warning',
             footer: 'L\'operazione è irreversibile',
             showCancelButton: true,
             allowOutsideClick: false,
             confirmButtonText:'SI \n Conferma eliminazione',
             cancelButtonText: 'NO Esci senza eliminare'
           }).then( (res) => {

                 if (res && res.value){

                 }

           });
     }


   }

   onClickVei(mode,veicolo: Veicolo, atIndex: number){

     const allegatiVeicolo = this.listaAllegatiVeicoli.filter(x=>x.id_Veicolo && x.id_Veicolo === veicolo.id)
   //  console.log(allegatiVeicolo);
     if(mode === 'edit'){
         const ref: MatDialogRef<AdminVeicoloDialogComponent> = this.dialog.open(
             AdminVeicoloDialogComponent,{
                 panelClass: 'dialog-responsive',
                 disableClose: true,
                 width:'90%',

                 maxWidth:'90%',
                 maxHeight:'90%',
                 data:{
                     veicolo,
                     allegatiVeicolo,
                     typeIstance:this.typeIstance,
                     typeDocuments: this.typeDocuments,
                     istanzaCheck:this.istanzaCheck,
                     istanza: this.istanza,
                     info:`N° protocollo ${this.istanza.id_ram}/${this.typeIstance.year} - ${this.istanza.ragione_sociale}`
                 }
             }
         )

         ref.afterClosed().subscribe(
             (res) => {
                 console.log(res)

                 if(res.allegati){
                   // let updateAllegati =
                   let otherAlle = [...this.listaAllegatiVeicoli.filter(x=>x.id_Veicolo && x.id_Veicolo !== veicolo.id)]

                   const updateRecords = [...otherAlle].concat(res.allegati)
                   console.log(updateRecords)
                   this.listaAllegatiVeicoli = [...updateRecords];
                   this.changeDetectorRef.markForCheck()

                 }
                 if(res.veicolo){
                     const upVeicoli = [...this.listaVeicoliFiltered];
                     upVeicoli[atIndex] = res.veicolo;
                     this.listaVeicoliFiltered = [...upVeicoli];
                     this.changeDetectorRef.markForCheck();
                 }

             }
         )
     }

   }

   onClickCert(data){
        // console.log(data)

      //   console.log(this.istanzaCheck)
         const ref: MatDialogRef<CheckCertDialogComponent> = this.dialog.open(
             CheckCertDialogComponent,
             {
                 data:{
                     istanzaCheck :this.istanzaCheck,
                     data,
                     alle:this.certEnable,
                     allegati: this.listaAllegatiDich
                 }
             }
         )
         ref.afterClosed().subscribe(
             (res:IstanzaCheck) => {
                 if(!!res){
                     this.istanzaCheck = res;
                     this.changeDetectorRef.markForCheck()
                 }
             }
         )
   }

   getIndicatorData(){
     this.alleTotal = this.listaAllegati.length;
  //   console.log(this.listaAllegati)
     this.allePending = this.listaAllegati.filter(x=> x.adminState ==='pending').length
     this.alleAccepted = this.listaAllegati.filter(x=> x.adminState ==='accepted').length
     this.alleRejecetd = this.listaAllegati.filter(x=> x.adminState ==='rejecetd').length

    // console.log(this.alleTotal, this.alleAccepted, this.allePending, this.alleRejecetd)
   }

   onClickGenerateReport(type){


     console.log(type)
     const ref: MatDialogRef<ReportsEditComponent>  = this.dialog.open(
         ReportsEditComponent,
         {
             minWidth:'65%',
             data:{
                 type:type,
                 istanza: this.istanza,
                 mode:'create'
             }
         }
     )

     ref.afterClosed().subscribe(
         (res: Report) => {
             if(!!res){
                 const updateRecords = [...this.reports].concat([res]);
                 this.reports = [...updateRecords];
                 this.changeDetectorRef.markForCheck();
             }
         }
     )
   }


}
