import { Report } from './../../../../../models/report.model';
import { statusAdminVei, typeReport } from './../../../../../../app.costants';
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

import { TypeIstance } from '@app/modules/models/type-istance.model';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { TypeReport } from '@app/modules/models/typeReport.model';
import { User } from '@app/modules/models/user.model';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { Store, select } from '@ngrx/store';
import { debounceTime, forkJoin, Observable, Subscription, take } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';

import { Location } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it'
import { FormControl, FormGroup } from '@angular/forms';
import { AdminReportEditComponent } from '../admin-report-edit/admin-report-edit.component';
import { ReportService } from '@app/modules/features/config/report.service';
import { PdfViewerSharedComponent } from '@app/modules/shared/components/pdf-viewer/pdf-viewer.component';
import { MomentModule } from 'ngx-moment';
import moment from 'moment';
import { TYPE } from '@app/modules/notifications/values.constants';
registerLocaleData(localeIt, 'it');
@Component({
  selector: 'app-admin-istanza-page',
  templateUrl: './admin-istanza-page.component.html',
  styleUrls: ['./admin-istanza-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[ConfigService,ReportService],
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

  totVeicoli:number;
  istruttoriaRend : boolean = false;
  istruttoriaData: Report;
  dataFineIstruttoria: any;

    constructor(private route: ActivatedRoute,
                private service: IstanzeService,
                private dialog: MatDialog,
                private dateAdapter: DateAdapter<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private store: Store<ApplicationState>,
                private location: Location ,
                private reportService: ReportService,
                private notifications: NotificationsComponent,
                private configService:ConfigService
                ) {
                  this.user = this.store.pipe(
                    select('authentication'),
                    select('user')
                  );
                  this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
                  this.dateAdapter.setLocale('it-IT');
                  this.istanza = this.route.snapshot.data.istanza;
                 // console.log(this.istanza)
                  this.rendicontazione = this.route.snapshot.data.rendicontazione;
                  this.istanzaCheck = this.route.snapshot.data.istanzaCheck;
                  //console.log(this.istanzaCheck)
                  this.rottamazione = (this.istanza.rim_rott_1 || this.istanza.rim_rott_2 || this.istanza.r_rott_1 || this.istanza.r_rott_2 || this.istanza.r_rott_3)?true:false;
                  this.totVeicoli = this.istanza.nv1 +
                  this.istanza.nv2 +
                  this.istanza.nv3 +
                  this.istanza.nv4 +
                  this.istanza.nv5 +
                  this.istanza.nv6 +
                  this.istanza.nv7 +
                  this.istanza.nv8 +
                  this.istanza.nv9 +
                  this.istanza.nv10


                  this.totCertEnable = 0;
                  this.certEnable = [];
                  this.certAttach = [];
                  this.certControlStatus = [];
                  this.listaAllegatiDich = [];
                  this.listaAllegati = [];
                  this.listaVeicoli = this.listaVeicoliFiltered = [];
               //   console.log(this.totVeicoli);
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
                    this.configService.fetchTypeReport({drop:true, typeistance:this.istanza.tipo_istanza}),
                    this.configService.fetchReport({drop:true, enable:true, id_ram:this.istanza.id_ram})
                ]).subscribe(([vei, alle,ista,typeDocument, typeReport, reports]) =>{
                    this.listaVeicoli= this.listaVeicoliFiltered = vei;
                    this.listaAllegati=alle;
                    this.typeIstance = ista;
                    //console.log(ista)
                    this.typeDocuments = typeDocument;
                    this.typeReport = typeReport;
                    //console.log(typeReport)
                    //console.log(reports)
                    this.reports = reports;
                    //this.getCertificazioni();
                    this.initializeAllegati(this.typeIstance);
                    this.getStatoIstruttoria(this.reports);
                    this.getIndicatorData()
                    /*   //console.log(vei, alle,ista) */
                    this.createVeiObservable()
                    this.changeDetectorRef.markForCheck()
                })
                 }

    ngOnInit() {
    }
    goBack(): void {
      this.location.back()
    }

    ngOnDestroy(): void {
        this.filtersVei$?.unsubscribe();
        this.data$?.unsubscribe();
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
                 //   //console.log(value, key)


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
                 // //console.log(filters, this.listaVeicoliFiltered)


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
   console.log(this.typeIstance.certAttach)
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
             //console.log(status); */
         }
     )


    }

    getEnableReport(data){
      console.log()
      const hasStatusInvioDefined = this.reports.some(record => record.statusInvio !== undefined &&  record.statusInvio !== 'pending'&& record.statusInvio !== null && record.enable);
      const enableGenerateReport = this.reports.every(obj => (obj.statusInvio === undefined || obj.statusInvio === 'completed') && obj.enable);
      if(this.rendicontazione.status !== 'opened' && (enableGenerateReport || this.reports.length ==0)){
        if(data.type === 'rigetto'){
          return this.listaAllegati.some(x=> x.adminState === 'rejected') ||  this.listaVeicoli.filter(x=> x.adminState === statusAdminVei.rejected)
         }else if(data.type === 'integrazione'){
       //   console.log(data)
          const check = this.listaAllegati.some(x=> x.adminState === 'rejected') || this.listaVeicoli.some(x=> x.adminState && x.adminState !== 'accepted')

          return check
         }else if(data.type === 'ammissione'){
          let listVeicoliAccetati = this.listaVeicoli.filter(x=> x.adminState === statusAdminVei.accepted);
      //   console.log(listVeicoliAccetati)
          let alleFiltrati = this.listaAllegati.filter(allegato => listVeicoliAccetati.map(veicolo => veicolo.id).includes(allegato.id_Veicolo));
       //   console.table(alleFiltrati)
        //  console.table(this.downloadrepodsas)
          let checkAlle = [...this.listaAllegatiDich, ...alleFiltrati].every(x=> x.adminState === 'accepted')

        //  console.log(checkAlle , listVeicoliAccetati)
          return checkAlle && (listVeicoliAccetati.length > 0)
         }else if(data.type === 'inammissibilita'){
          return this.reports.length > 0 &&  this.reports.find(x=> x.typeReport === data.id && x.status ==='send' && x.enable) ? true: false
         }
      }
      return false

    }

    getCertificazioniData(type,mode?,typeResponse?){
      // //console.log(type)
      switch (mode) {
          case 'cert':
              const certData = this.istanzaCheck[type]??'toWork';
              const noteAdminData = this.istanzaCheck['note'+type[0].toUpperCase() + type.slice(1)]
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
              return  {status,data:alleData};

      }


    }

    getCertData(type){
      //console.log(type);


    }

    checkStatusVeicoli(mode?:string){
      if(mode){
       return this.listaVeicoli.filter(x=> x.adminState === mode)

      }else{
       return this.listaVeicoli.filter(x=> x.adminState !== 'accepted')
      }
    }
    getTotalCostRiepilogo(mode:string){

      if(mode === 'total'){
       return this.listaVeicoli.reduce((total, current) => {
          if (current.adminState === "accepted") {
            let t = total + current.amount + (current.pmiIstr??0) + (current.reteIstr??0)
              return  t;
          } else {
              return total;
          }
      }, 0);

      }else{
      return this.listaVeicoli.reduce((total, current) => {
          if (current.adminState === "accepted") {
              return total + current[mode];
          } else {
              return total;
          }
      }, 0);
    }




    }

    initializeAllegati(typeIstance:TypeIstance){
      this.listaAllegatiVeicoli = this.listaAllegati.filter(x=> x.typeDocument !== 'ampl' && x.typeDocument !== 'pmi' && x.typeDocument !== 'rete');

      typeIstance.certAttach.map(
          (cert) => {
            console.log(cert)
              let campoDb = cert['description'];
              if(campoDb === 'ampl' && this.rottamazione){

              }
              const cList = this.listaAllegati.filter(x=> x.typeDocument === campoDb )
              const upList = [...this.listaAllegatiDich.concat(cList)];
              this.listaAllegatiDich = [...upList];
              let check = this.istanza[campoDb]??null;
              if(check === 'Yes' ||
              (campoDb === 'pmi' && (
                this.istanza.tipo_impresa === '1' ||
                this.istanza.tipo_impresa === '2'
                )
                )||
                ((this.istanza.rim_nv_1 > 0 || this.istanza.rim_nv_2 > 0) && campoDb === 'ampl')){
                  this.totCertEnable++;
                  this.certEnable.push(cert);
              }
              if(!cert['upload']){
                  this.certControlStatus.push(cert)
              }

          }
      )
      console.log (this.certControlStatus)
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
                          //console.log(res)
                          if(!!res){
                              const currentRecordsA = [...this.listaAllegati];
                              const currentRecordsB = [...this.listaAllegatiDich];
                              currentRecordsA[this.listaAllegati.findIndex(x=> x.id === res.id)] = res;
                              currentRecordsB[this.listaAllegatiDich.findIndex(x=> x.id === res.id)] = res;
                              this.listaAllegati = [...currentRecordsA];
                              this.listaAllegatiDich = [...currentRecordsB];


                              if(res.typeDocument && res.typeDocument === 'pmi'){
                                  this.istanzaCheck.pmi = res.adminState
                              }

                              if(res.typeDocument && res.typeDocument === 'rete'){
                                  this.istanzaCheck.rete = res.adminState
                              }
                              this.service.updateIstanzaCheck(this.istanzaCheck).subscribe(
                                  {
                                      next:(res: IstanzaCheck) => this.istanzaCheck = res,
                                      complete:()=> this.changeDetectorRef.markForCheck()

                                  }
                              )
                          }
                      }
                  )
          },
              error => console.log('Error downloading the file.')
          );
    }

    viewReport(data:Report){
      let file = data.fd;
      this.service.getFile(file)
      .subscribe(
        {
          next:(res) => {
            console.log(file)
             const blob = new Blob([res],{type: file['type']});
             const url = window.URL.createObjectURL(blob);
             window.open(url);
            //  const ref: MatDialogRef<PdfViewerSharedComponent> = this.dialog.open(PdfViewerSharedComponent,
            //      {
            //          data:{
            //              url: url
            //          }
            //      }
            //  );
         },
             error: () => console.log('Error downloading the file.')
         });
    }

    downloadReport(data:Report){
      let file = data.fd;
      this.service.getFile(file).subscribe({
        next:(res) => {
          const blob = new Blob([res],{type: file['type']});
          let f = window.URL.createObjectURL(blob).toString();
          const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
          a.href = f;
          a.download = file['filename'];
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(f);
        }
      })
    }
    deleteReport(id){
      Swal.fire({
        title: 'Vuoi eliminare il report?',
        text: 'Non potrai più recuperarlo',
        icon: 'warning',
        footer: 'L\'operazione è irreversibile',
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText:'SI \n Conferma eliminazione',
        cancelButtonText: 'NO Esci senza eliminare'
      }).then( (res) => {
        if (res && res.value){
          this.configService.updateReport({
            id,
            status:'disabled',
            enable:false,
          }).subscribe({
            next:(res)=> {
              if(!!res){
                this.reports = this.reports.filter((x) => x.id !== res.id && x.enable)
              }
            },
            complete:()=> this.changeDetectorRef.markForCheck()
          })
        }
      });
    }

    getTipoVeicolo(tipo){
      const data = this.typeIstance.typeVei.find(X => X['campoDb'] === tipo);
      return data['description'];
    }

    getStatoIstruttoria(reports: Report[]){
      if(this.rendicontazione.status === 'closed' || this.rendicontazione.status === 'reporting'){
          this.statoIstruttoria = 'enabled';
          this.funzioniIstruttoria = true;
          if((this.istanzaCheck.updatedAt > this.istanzaCheck.createdAt) || this.listaAllegati.some(x=> x.adminState !== null)){

           if(reports.length > 0){
            const validReports = reports.filter(obj => obj.dataInvio !== null);
            validReports.sort((a, b) => Number(b.dataInvio) - Number(a.dataInvio));
            if(validReports.length > 0){
              this.statoIstruttoria = validReports[0].typeReport['type'];
              console.log(validReports[0])
              this.istruttoriaRend = true;
              this.istruttoriaData = validReports[0];
              if(this.istruttoriaData.typeReport['type'] === 'integrazione'){
                this.dataFineIstruttoria = moment(Number(this.istruttoriaData.dataInvio)).add(15,'days')

              }
            }
           }else{
            this.statoIstruttoria = 'work';
           }

          }
          else if(this.istanzaCheck.updatedAt === this.istanzaCheck.createdAt){
            this.statoIstruttoria = 'pending';
          }
      }else if(this.rendicontazione.status === 'opened'){
        this.statoIstruttoria = 'rendOpen'
      }
    }

    onClickAllegato(mode, data?, atIndex?){
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
                      dataIstruttoria:this.istruttoriaData,
                      rendicontazione: this.rendicontazione,

                      info:`N° protocollo ${this.istanza.id_ram}/${this.typeIstance.year} - ${this.istanza.ragione_sociale}`
                  }
              }
          )

          ref.afterClosed().subscribe(
              (res) => {
                  console.log(res)

                  if(res.allegati){
                    let otherAlle = [...this.listaAllegatiVeicoli.filter(x=>x.id_Veicolo && (x.id_Veicolo !== res.veicolo.id))]
                    const updateRecords = [...otherAlle].concat(res.allegati)
                    this.listaAllegatiVeicoli = [...updateRecords];
                    this.listaAllegati = [...this.listaAllegatiDich, ...this.listaAllegatiVeicoli];
                  }
                  if(res.veicolo){
                      const upVeicoli = [...this.listaVeicoliFiltered];
                      upVeicoli[atIndex] = res.veicolo;
                      this.listaVeicoli = this.listaVeicoliFiltered = [...upVeicoli];
                  }
                  this.changeDetectorRef.markForCheck()

              }
          )
      }

    }

    onClickCert(data){
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
      this.allePending = this.listaAllegati.filter(x=> x.adminState ==='pending').length
      this.alleAccepted = this.listaAllegati.filter(x=> x.adminState ==='accepted').length
      this.alleRejecetd = this.listaAllegati.filter(x=> x.adminState ==='rejecetd').length
    }

    onClickGenerateReport(type){
      const ref: MatDialogRef<ReportsEditComponent>  = this.dialog.open(
          ReportsEditComponent,
          {
              minWidth:'65%',
              data:{
                  type:type,
                  istanza: this.istanza,
                  veicoli:this.listaVeicoli,
                  allegati:this.listaAllegati,
                  istanzaCheck: this.istanzaCheck,
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
    onClickReport(mode, typeReport?:typeReport, atIndex?,report?:Allegato){

      if(mode !== 'send'){
        const ref : MatDialogRef<AdminReportEditComponent> = this.dialog.open(AdminReportEditComponent,{
          panelClass: 'dialog-responsive',
          //disableClose: true,
          width:'90%',
          maxWidth:'90%',
          maxHeight:'90%',
          data: {
              mode,
              report,
              typeReport,
              userData:this.userMe,
              reports: this.reports,
              istanza:this.istanza,
              typeInstance:this.typeIstance,
              veicoli:this.listaVeicoli,
              typesDocuments:this.typeDocuments,
              listaAllegatiDich: this.listaAllegatiDich,
              listaAllegatiVeicoli: this.listaAllegatiVeicoli

          }
        })

        ref.afterClosed().subscribe(
          (res) => {
            if(!!res){
              if(mode === 'generate'){
                const updatedRecords = [...this.reports].concat([res]);
                this.reports = [...updatedRecords];
                this.changeDetectorRef.markForCheck();
              }else if(mode ==='edit' || mode === 'prepare'){
                const currentRecords = [...this.reports];
                currentRecords[atIndex] = res;
                this.reports = [...currentRecords];
                this.changeDetectorRef.markForCheck();
              }

            }
          }
        )
      }else{
        Swal.fire({
          title: 'Vuoi inviare la pec?',
          icon: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonText:'SI \n Invia la pec',
          cancelButtonText: 'NO Esci senza inviare'
        }).then( (res) => {
              if (res && res.value){

                let payloadReport = {
                  id: report.id,
                  dataInvio: moment().format('x'),
                  userInvio:this.userMe.id,
                  status:'sent',
                  statusInvio:'completed'
                }

                console.log(payloadReport)
                this.configService.updateReport(payloadReport).subscribe({
                  next:(res) => {
                    console.log(res)
                    if(!!res){
                      const currentRecords = [...this.reports];
                      currentRecords[atIndex] = res;
                      this.reports = [...currentRecords];
                      this.changeDetectorRef.markForCheck();
                      this.notifications.toast(
                        TYPE.SUCCESS,
                          'Operazione Completata',
                          'Pec Inviata con Successo'
                      )
                    }
                  }
                })

              }
        });
      }

    }



}
