import { typeReport } from '@app/app.costants';
import { PdfViewerSharedComponent } from './../../../../../shared/components/pdf-viewer/pdf-viewer.component';
import { FormAllegatoComponent } from './../form-allegato/form-allegato.component';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApplicationState } from '@app/app.state';
import { Allegato } from '@app/modules/models/allegato.model';
import { Istanza, Rendicontazione } from '@app/modules/models/istanza.model';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { User } from '@app/modules/models/user.model';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { select, Store } from '@ngrx/store';
import { forkJoin, Observable, Subscription, take } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';
import Swal from 'sweetalert2';
import { TYPE } from '@app/modules/notifications/values.constants';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { ConfigService } from '@app/modules/features/config/config.service';
import { ReportService } from '@app/modules/features/config/report.service';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { TypeReport } from '@app/modules/models/typeReport.model';
import { Report } from '@app/modules/models/report.model';
import moment from 'moment';

@Component({
  selector: 'app-user-istanza-edit',
  templateUrl: './user-istanza-edit.component.html',
  styleUrls: ['./user-istanza-edit.component.scss'],
  providers:[ConfigService,ReportService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIstanzaEditComponent implements OnInit {
  user: Observable<User>;
  userMe: User;
  mode: string;
  istanza: Istanza;
  typeIstance:TypeIstance;
  typeIstance$: Subscription;
  catA: boolean;
  catB: boolean;
  catC: boolean;
  catD: boolean;
  typeVeiGroupView: [];
  catEnable:[];
  veiForCat:{cat:string, number: number}[];
  catVei:{
      id?:number;
      category: string;
      description: string;
  }[];
  certEnable:any[];
  listaVeicoli: Veicolo[];
  listaAllegati: Allegato[];
  listaAllegatiDich: Allegato[];
  vei$: Subscription;
  totVeicoli:number;
  totCertEnable:number;
  totAllegati:number;

  rottamazione: boolean;

  rendicontazione: Rendicontazione;

  today:Date;
  enableRendicontazione: boolean;
  isLoading = true;
  isExpired = false;

  typeDocuments: TypeDocument[] =[];
  typeReport: TypeReport[] = [];
  reports: Report[] = [];
  istruttoriaRend : boolean = false;
  istruttoriaData: Report;
  dataFineIstruttoria: any;
  integrazione = false;
  catIntegrazione:string;
  tipoVeicoloIntegrazione : string;
  veicoliIntegrazione : Veicolo[] = [];
  allegatiDichiarazioneIntegrazione: Allegato[] = [];


    constructor(  private route: ActivatedRoute,
                  private service: IstanzeService,
                  private dialog: MatDialog,
                  private configService: ConfigService,
                  private changeDetectorRef: ChangeDetectorRef,
                  private store: Store<ApplicationState>,
                  private notifications: NotificationsComponent,) {

                    this.user = this.store.pipe(select('authentication'), select('user'));
                    this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
     // this.userMe.role = 'user';
   //  console.log(this.userMe)
                    this.istanza = this.route.snapshot.data.istanza;
                    this.rendicontazione = this.route.snapshot.data.rendicontazione;
                    //console.log(this.rendicontazione)
                    this.typeIstance = null;
                    this.typeVeiGroupView =[];
                    this.catEnable = [];
                    this.veiForCat = [];
                    this.certEnable = [];
                    this.listaVeicoli = [];
                    this.listaAllegatiDich =[];
                    this.listaAllegati=[];
                    this.totAllegati=0;
                    this.rottamazione=false;
                    this.enableRendicontazione =true;

                    this.totVeicoli = Number(this.istanza.nv1) +
                    Number(this.istanza.nv2) +
                      Number(this.istanza.nv3) +
                        Number(this.istanza.nv4) +
                          Number(this.istanza.nv5) +
                            Number(this.istanza.nv6) +
                              Number(this.istanza.nv7) +
                                Number(this.istanza.nv8) +
                                  Number(this.istanza.nv9) +
                                    Number(this.istanza.nv10);
                    this.totCertEnable = 0;
                    // this.rottamazione = (
                    //   this.istanza.rim_rott_1 ||
                    //   this.istanza.rim_rott_2 ||
                    //   this.istanza.r_rott_1 ||
                    //   this.istanza.r_rott_2 ||
                    //   this.istanza.r_rott_3
                    //   )?true:false;

                    this.today= new Date();
                    this.vei$ = forkJoin([
                      this.service.fetchVeicoli({drop:true, id_ram: this.istanza.id_ram}),
                      this.service.fetchAllegati({drop:true,id_ram: this.istanza.id_ram, enable:true}),
                      this.service.getTypeInstance(this.istanza.tipo_istanza),
                      this.configService.fetchTypeDocuments({drop:true}),
                      this.configService.fetchTypeReport({drop:true, typeistance:this.istanza.tipo_istanza}),
                      this.configService.fetchReport({drop:true, enable:true, id_ram:this.istanza.id_ram})
                    ]).subscribe(
                      ([vei,alle,ista, typeDocument, typeReport, reports]) => {
                          this.listaVeicoli=vei;
                          this.listaAllegati=alle;
                          this.typeIstance = ista;
                          console.log(reports,this.typeDocuments, typeReport)
                          this.isExpired = Number(this.typeIstance.reportingEndDate) < this.today.getTime()
                          console.log('è scaduta:'+this.isExpired)
                          this.typeDocuments = typeDocument;
                          this.typeReport = typeReport;
                          this.reports = reports;
                          this.typeVeiGroupView = this.groupByKey(this.typeIstance.typeVei,'catVei');
                          this.typeIstance.certAttach.map(
                              (cert) => {

                                  let campoDb = cert['description'];
                                //   if(campoDb === 'ampl' && this.rottamazione){
                                //   }
                                  const cList = this.listaAllegati.filter(x=> x.typeDocument === campoDb )
                                  const upList = [...this.listaAllegatiDich.concat(cList)];
                                  this.listaAllegati = this.listaAllegati.filter(x=> x.typeDocument !== campoDb)
                                  this.listaAllegatiDich = [...upList];
                                  let check = this.istanza[campoDb]??null;
                                  if(check === 'Yes' ||
                                  (campoDb === 'pmi' &&(this.istanza.tipo_impresa === '1' || this.istanza.tipo_impresa === '2'))||
                                   ((this.istanza.rim_nv_1 > 0 || this.istanza.rim_nv_2 > 0) && campoDb === 'ampl')){
                                      this.totCertEnable++;
                                      this.certEnable.push(campoDb);
                                  }
                              }
                          )
                          this.typeIstance.categoryVei.map(
                              (cat) => {
                                  let category = cat['category']
                                  this.veiForCat.push({cat:category,number:0})
                              }
                          )
                          this.typeIstance.typeVei.map(
                              (typeVei) => {
                                  let campoDb = typeVei['campoDb'];
                                  let cat = typeVei['catVei']
                                  if(this.istanza[campoDb] > 0){
                                      const nAlle: any[] = typeVei['typeDocument']
                                      this.totAllegati = nAlle.length  * this.istanza[campoDb]

                                      if(!this.catEnable.includes(cat)) {
                                           this.catEnable.push(cat)
                                      }

                                      this.veiForCat.map(
                                          (x)=>{
                                              if(x.cat === cat)  x.number = x.number + this.istanza[campoDb]
                                          })
                                  }

                              }
                          )

                          const reportingStartDate = new Date(Number(this.typeIstance.reportingStartDate));
                          const reportingEndDate = new Date(Number(this.typeIstance.reportingEndDate));

                          if(this.today > reportingEndDate || this.today < reportingStartDate){

                              this.enableRendicontazione =false;
                              this.rendicontazione.enable = false;
                          }
                          let istruttoria = this.getStatusIstruttoria(this.reports);
                        //  console.log(this.enableRendicontazione)
                          if(istruttoria){
                            this.istruttoriaData = istruttoria;
                            let typeReport = istruttoria.typeReport['type'];
                            //console.log(typeReport)

                            if(typeReport === 'integrazione'){
                              this.dataFineIstruttoria= moment(Number(this.istruttoriaData.dataInvio)).endOf('day').add(15,'days');

                              this.integrazione = false;
                              let scadenza = moment();
                         //    console.log(this.dataFineIstruttoria)
                              if(this.dataFineIstruttoria.isAfter(moment())){
                          //      console.log('rendicondazione apertra')
                                this.enableRendicontazione =true;
                                this.rendicontazione.enable = true;
                                this.istruttoriaRend = true;
                                this.integrazione = true;
                                const idVeicoliFiltrati = this.listaAllegati
                                  .filter(obj => obj.adminState !== 'accepted')
                                  .map(obj => obj.id_Veicolo);
                                //console.log(idVeicoliFiltrati);
                                const veicoliFiltrati = this.listaVeicoli.filter(veicolo => idVeicoliFiltrati.includes(veicolo.id));
                              }else{
                            //    console.log('rendicondazione chiusaa')
//
                              }
                            }
                          }

                          console.log( this.enableRendicontazione )
                          this.changeDetectorRef.markForCheck()
                          this.isLoading = false;
                  })

                  }

    ngOnInit() {
    }
    ngOnDestroy(): void {
      this.vei$.unsubscribe()
    }
    private groupByKey(array, key) {
      return array
      .reduce((hash, obj) => {
          if(obj[key] === undefined) return hash;
          return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
      }, {})
    }
    getCatData(cat): any{
      const data = this.typeIstance.categoryVei.find(x=> x['category'] === cat)
      return data;
  }
  getTotalForCat(cat): any{
      const data = this.veiForCat.find(x=> x.cat === cat)
      if(data.number === 1){
          return `${data.number} veicolo`
      }
      if(data.number > 1){
          return `${data.number} veicoli`
      }
  }

  getCertEnableData(type): string{

      const data =  this.typeIstance.certAttach.find(x=> x['description'] === type)
    //  console.log(data)
      return data['longDescription'];

  }

  newAllegato(type): void{
      //console.log(type)
      let data = {};
      const dataType = this.typeIstance.certAttach.find(x=> x['description'] === type)
          data={
              mode:'create',
              istanza:this.istanza,
              type: dataType
          }

      const ref: MatDialogRef<FormAllegatoComponent> = this.dialog.open(FormAllegatoComponent,{
          panelClass: 'dialog-responsive',
          disableClose: true,
          width:'60%',

          data: data
      })
      ref.afterClosed().subscribe(
          (res:Allegato) => {
              if(!!res){
                  const updatedRecords = [...this.listaAllegatiDich].concat([res]);

                  this.listaAllegatiDich = [...updatedRecords];
                  this.changeDetectorRef.markForCheck();
              }
          }
      )
  }

  onClickEditAllegato(mode: string,type?,  allegato?:Allegato, atIndex?): void {
      let data = {};
      if(mode === 'edit'){
          const dataType = this.typeIstance.certAttach.find(x=> x['description'] === type)
          data={
              mode,
              istanza:this.istanza,
              type: dataType,
              allegato
          }

      const ref: MatDialogRef<FormAllegatoComponent> = this.dialog.open(FormAllegatoComponent,{
          panelClass: 'dialog-responsive',
          disableClose: true,
          width:'60%',

          data: data
      })
      ref.afterClosed().subscribe(
          (res:Allegato) => {
              if(!!res){
                  const indexList = this.listaAllegatiDich.findIndex(x=> x.id === res.id)

                  const updatedRecords = [...this.listaAllegatiDich];
                  updatedRecords[indexList] = res;
                  this.listaAllegatiDich = [...updatedRecords];
                  this.changeDetectorRef.markForCheck();
              }
          }
      )
      }
      if(mode === 'create'){


          const dataType = this.typeIstance.certAttach.find(x=> x['description'] === type)
              data={
                  mode,
                  istanza:this.istanza,
                  type: dataType
              }

          const ref: MatDialogRef<FormAllegatoComponent> = this.dialog.open(FormAllegatoComponent,{
              panelClass: 'dialog-responsive',
              disableClose: true,
              width:'60%',

              data: data
          })
          ref.afterClosed().subscribe(
              (res:Allegato) => {
                  if(!!res){
                      const updatedRecords = [...this.listaAllegatiDich].concat([res]);
                      this.listaAllegatiDich = [...updatedRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }
  }

  getAlleDichiarazioniData(type): Allegato{
      if(this.listaAllegatiDich){
        return  this.listaAllegatiDich.find(x=> x.typeDocument === type)
      }
  }

  viewAllegato(file): void{

      this.service.getFile(file)
      .subscribe(
          (res) => {
              const blob = new Blob([res],{type: file.type});
              const url = window.URL.createObjectURL(blob);
              window.open(url);
              // const ref: MatDialogRef<PdfViewerSharedComponent> = this.dialog.open(PdfViewerSharedComponent,
              //     {
              //         data:{
              //             url: url
              //         }
              //     }
              // );
          },
              error => console.log('Error downloading the file.')
          );
  }

  downloadAllegato(file): void{

      this.service.getFile(file)

      .subscribe(
        {
          next: (res) => {
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
        error:() => console.log('Error downloading the file.')

        }
      )


  }

  addVei(res){

      if(!!res){
          const updatedRecords = [...this.listaVeicoli].concat([res]);

          this.listaVeicoli = [...updatedRecords];
          this.changeDetectorRef.markForCheck();
      }
  }

  addAlle(res){
      if(!!res){
          const updatedRecords = [...this.listaAllegati].concat([res]);

          this.listaAllegati = [...updatedRecords];
          this.changeDetectorRef.markForCheck();
      }
  }

  onClickRend(mode:boolean): void{



      if(mode === false){
          Swal.fire({
              title: 'Attenzione!',
              text: 'Vuoi Aprire la rendicontazione?',
              icon: 'warning',
              cancelButtonText:'Annulla',
              showCancelButton: true,
              allowOutsideClick: false
            }).then( (res) => {
              if (res && res.value){
                  const payload = {
                      id: this.rendicontazione.id,
                      id_ram:this.istanza.id_ram,
                      enable: true,
                      userEnable: this.userMe.email,
                      dateStart: new Date().getTime(),
                      status:'opened'
                  }
                  //console.log(payload)
                  this.service
                  .updateRendicontazione(payload)
                  .subscribe(
                      (res) => {
                          if(!!res){
                              this.notifications.toast(
                                  TYPE.SUCCESS,
                                  'Operazione Completata',
                                  'Rendicondazione Aperta con Successo'
                              )
                              this.rendicontazione = res;
                              this.changeDetectorRef.markForCheck();
                          }
                      }
                  )
              }

            })

      }

      if(mode ===true){
          const checkAlleCert = this.totCertEnable <= this.listaAllegatiDich.length;
          const checkVeiLoad = this.totVeicoli <= this.listaVeicoli.length;
          //const checkAlleVei = this.totAllegati <= this.listaAllegati.length;
         // console.log(checkAlleCert,checkVeiLoad);
          const html = `
          <h2>La documentazione non è completa!<br>
          Vuoi Chiudere ugualmente la rendicontazione?</h2>
          <h3>Dettaglio documentazione</h3>
                      <table style="margin-left:5%">
                      <tr><td>Allegati Dichiarazione</td><td><i class="material-icons" style="color:${checkAlleCert?'green':'red'}">${checkAlleCert?'done':'cancel'}</i></td><td>${this.listaAllegatiDich.length} di ${this.totCertEnable}</td></tr>
                      <tr><td>Informazioni Veicoli</td><td><i class="material-icons" style="color:${checkVeiLoad?'green':'red'}">${checkVeiLoad?'done':'cancel'}</i></td><td>${this.listaVeicoli.length} di ${this.totVeicoli}</td></tr>
                      </table>


          `
          Swal.fire({
              title: 'Attenzione!',
              text: 'Vuoi Chiudere la rendicontazione?',
              icon: 'warning',
              footer: 'L\'operazione è irreversibile',
              cancelButtonText:'Annulla',

              showCancelButton: true,
              allowOutsideClick: false
            }).then( (res) => {
                  if (res && res.value){
                      const payload = {
                          id: this.rendicontazione.id,
                          id_ram: this.istanza.id_ram,
                          enable: false,
                          userDisable: this.userMe.email,
                          dateDisable: new Date().getTime(),
                          dateEnd: new Date().getTime(),
                          status:'closed'
                      }
                      if(!checkAlleCert || !checkVeiLoad){
                          Swal.fire({
                              title: 'Attenzione!',
                              text: 'Non è stata caricata tutta la documentazione. Vuoi chiudere la rendicontazione?',
                              icon: 'warning',
                              html: html,
                              footer: 'L\'operazione è irreversibile',
                              showCancelButton: true,
                              allowOutsideClick: false
                            }).then( (res) => {
                              if (res && res.value){
                                 // console.log(payload)
                              this.service
                                  .updateRendicontazione(payload)
                                  .subscribe(
                                      (res) => {
                                          if(!!res){
                                              this.notifications.toast(
                                                TYPE.SUCCESS,
                                                  'Operazione Completata',
                                                  'Rendicondazione Chiusa con Successo'
                                              )
                                              this.rendicontazione = res;
                                              this.changeDetectorRef.markForCheck();
                                          }
                                      }
                                  )
                              }
                            })
                      }else{
                          //console.log(payload)
                          this.service
                          .updateRendicontazione(payload)
                          .subscribe(
                              (res) => {
                                  if(!!res){
                                      this.notifications.toast(
                                        TYPE.SUCCESS,
                                          'Operazione Completata',
                                          'Rendicondazione Chiusa con Successo'
                                      )
                                      this.rendicontazione = res;
                                      this.changeDetectorRef.markForCheck();
                                  }
                              }
                          )
                      }



                  }
            });
      }
  }

  onClickDeleteAllegato(alle:Allegato): void{
      Swal.fire({
          title: 'Attenzione!',
          text: 'Vuoi eliminare l\'Allegato',
          icon: 'warning',
          footer: 'L\'operazione è irreversibile',
          showCancelButton: true,
          allowOutsideClick: false
        }).then( (res) => {
              if (res && res.value){
                  alle.enable = false;
                  this.service.updateAllegato(alle).subscribe(
                    {
                   next:(res:Allegato) =>{
                       if(!!res){
                          this.listaAllegatiDich = this.listaAllegatiDich.filter((x)=> x.id !== alle.id)
                       }
                   },
                   error:(err)=> console.log(err),
                   complete:()=>   this.changeDetectorRef.markForCheck()
              })
              }
          })
  }

  getStatusIstruttoria(reports: Report[]){
    const validReports = reports.filter(obj => obj.dataInvio !== null);
    validReports.sort((a, b) => Number(b.dataInvio) - Number(a.dataInvio));
    if(validReports.length > 0){
      return validReports[0];
    }
    return false


}

blinkBadgeIntegrazione(type, data?){

  let blink = false;
  if(this.istruttoriaData   && this.istruttoriaData.typeReport['type'] === 'integrazione'){
    if(type === 'alle-dichiarazione'){
      blink = this.listaAllegatiDich.some(x=>x.adminState !=='accepted')

    }else {
      const idVeicoliFiltrati = this.listaAllegati
      .filter(obj => obj.adminState !== 'accepted' && obj.id_Veicolo && obj.enable)
      .map(obj => obj.id_Veicolo)
      .filter((id, index, array) => array.indexOf(id) === index);
      ;
//console.log(idVeicoliFiltrati);
      if(type ==='category'){


        const veicoliFiltrati = this.listaVeicoli.filter(veicolo => veicolo.category === data && idVeicoliFiltrati.includes(veicolo.id));

        if(veicoliFiltrati.length > 0){
          return true
        }
      }
    }
  }

  return false
}



}
