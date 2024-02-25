import { PdfViewerSharedComponent } from './../../../../../shared/components/pdf-viewer/pdf-viewer.component';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Allegato } from '@app/modules/models/allegato.model';
import { Istanza, Rendicontazione } from '@app/modules/models/istanza.model';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { FormControl, FormGroup } from '@angular/forms';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { User } from '@app/modules/models/user.model';
import { Subscription, Observable, take, debounceTime } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '@app/app.state';
import { IstanzeService } from '../../../istanze.service';
import Swal from 'sweetalert2';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { FormAllegatoVeicoloComponent } from '../form-allegato-veicolo/form-allegato-veicolo.component';
import { FormVeiComponent } from '../form-vei/form-vei.component';
import { Report } from '@app/modules/models/report.model';
import moment from 'moment';

@Component({
  selector: 'app-content-vei',
  templateUrl: './content-vei.component.html',
  styleUrls: ['./content-vei.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentVeiComponent implements OnInit, OnDestroy {
    @Input() category: any;
    @Input() typeIstance: TypeIstance;
    @Input() istanza: Istanza;
    @Input() listVei: Veicolo[];
    @Input() rendicontazione: Rendicontazione;
    @Input() listaAllegati: Allegato[];
    @ViewChild('catlist') catlist: MatSelectionList;
    @Output() newVeicoloEvent = new EventEmitter<Veicolo>();
    @Output() newAllegatoEvent = new EventEmitter<Allegato>();
    @Input() rottamazione: boolean;
    @Input() enableRendicontazione: boolean;
    @Input() istruttoriaData: Report;

    vei$:Subscription;
    docList: any[];
    listVeiFiltered: Veicolo[];
    listAlleFiltered: Allegato[];
    typeDocuments: TypeDocument[];
    typeDoc$: Subscription;
    user: Observable<User>;
    userMe: User;

    filters: FormGroup;
    filters$: Subscription;
    docListVei: any[];
    constructor(
      private dialog: MatDialog,
      private service: IstanzeService,
      private store: Store<ApplicationState>,
      private changeDetectorRef: ChangeDetectorRef,
    ) {

      this.user = this.store.pipe(select('authentication'), select('user'));
      this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
      this.docList = this.docListVei= [];
      this.listVeiFiltered = [];
      this.listAlleFiltered =[];
      this.filters = new FormGroup({
          targa: new FormControl(null),

      });
      this.typeDoc$ = this.service.fetchTypeDocuments({drop:true}).subscribe(
          (records: TypeDocument[]) => this.typeDocuments = records,
      )

    }

    ngOnInit(): void {
      this.filters$ = this.filters.valueChanges
      .pipe(debounceTime(400))
      .subscribe(
          (value: { [key: string]: string }) => {
              const filters = {};

              Object.keys(value)
                  .forEach((key: string) => filters[key] = value[key]);

          })
    }
    ngOnDestroy(): void {
      this.typeDoc$.unsubscribe()
      this.filters$.unsubscribe()
    }
    onSelection(event:MatSelectionListChange,data):void{
      const catData = event.source.selectedOptions.selected[0].value
      this.listVeiFiltered = this.listVei.filter(
          (item) => item.category === catData.catVei && item.type === catData.campoDb
      )
      const doc = this.typeIstance.typeVei.find(
          x=> x['campoDb'] === catData.campoDb
      )

      this.docList = doc['typeDocument'];
     //  console.log(this.rottamazione, this.docList)
     //console.log(catData)
      if(!this.rottamazione){
          this.docList = this.docList.filter(x=> (x !== 11 && x !== 14))
      }
      let checkTypeVeiRottamazione = this.istanza['rott'+parseInt(catData['campoDb'].match(/\d+/)[0])];
     // console.log(checkTypeVeiRottamazione)
      if(checkTypeVeiRottamazione > 0){
        this.docList.push(11,14)
      }
      this.docListVei = this.docList;


    }
    onClickInsertVei(mode, vei?:Veicolo, atIndex?): void{
      let data = {};
      if(mode === 'create'){
          data={
              mode,
              istanza:this.istanza,
              typeVei:this.catlist.selectedOptions.selected[0].value
          }
          const ref: MatDialogRef<FormVeiComponent> = this.dialog.open(FormVeiComponent,{
              panelClass: 'dialog-responsive', data: data
          });
          ref.afterClosed().subscribe(
              (res:Veicolo)=>{
                  if(!!res){
                      this.newVeicoloEvent.emit(res);
                      const updatedRecords = [...this.listVeiFiltered].concat([res]);
                      this.listVeiFiltered = [...updatedRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }
      if(mode === 'edit'){
          data={
              mode,
              istanza:this.istanza,
              typeVei:this.catlist.selectedOptions.selected[0].value,
              vei
          }
          const ref: MatDialogRef<FormVeiComponent> = this.dialog.open(FormVeiComponent,{
              panelClass: 'dialog-responsive',
              disableClose: true,
              data: data
          });
          ref.afterClosed().subscribe(
              (res:Veicolo)=>{
                  if(!!res){

                  const currentRecords = [...this.listVeiFiltered];
                  currentRecords[atIndex] = res;
                  this.listVeiFiltered = [...currentRecords];
                  this.changeDetectorRef.markForCheck();
                  }
              }
          )
      }
  }

  checkVeiData(vei: Veicolo): any{
      let res = {
          text: 'Dati Veicolo Non Presenti',
          icon: 'close',
          color: 'red'
      }
      if(vei.licensePlate && vei.brand && vei.model && vei.acquisitionType && vei.amount){
          res = {
              text: 'Dati Veicolo Presenti',
              icon: 'done',
              color:'green'
          }


      }
      return res
  }
  checkAlleVei(vei: Veicolo):any{

      const unique = [...new Set(this.listaAllegati.map(item => item.typeDocument))];

      let res = {
          text: 'Documenti non presenti',
          icon: 'close',
          color: 'red'
      }
      const data = this.listaAllegati.filter(
          (alle) => alle.id_Veicolo === vei.id && alle.enable === true && unique.includes(alle.typeDocument)
      )

      if(vei.acquisitionType === '01'){
          this.docListVei = this.docList.filter(x=> x !== 9 )
      }else{
          this.docListVei = this.docList
      }

      if(data.length > 0){
          return unique
      }

      return false;

  }
  getTypeDocumentData(type): any{


      return  this.typeDocuments.find(x => x.id === Number(type))

  }

  getAllegatoVeicolo(v: Veicolo, doc): Allegato{
      const data =  this.listaAllegati.find(
          (alle) => alle.id_Veicolo === v.id && alle.typeDocument === doc.toString() && alle.enable === true
      )
      return data;
  }

  getAllegatiVeicolo(v:Veicolo):any{

    //console.log(v)
      this.listAlleFiltered = this.listaAllegati.filter(
          (item) => item.typeVei === v.type && item.id_Veicolo === v.id && item.enable === true
      )
      return this.listAlleFiltered;
  }

  newAllegato(v: Veicolo): void{
      const data ={
          mode:'create',
          istanza:this.istanza,
          docList: this.docList,
          typeDocuments: this.typeDocuments,
          veicolo: v
      }

      const ref : MatDialogRef<FormAllegatoVeicoloComponent> = this.dialog.open(FormAllegatoVeicoloComponent,{
          panelClass: 'dialog-responsive',
          disableClose: true,
          width:'60%',
          data
          //type: typeDocument
      })
      ref.afterClosed().subscribe(
          (res:Allegato) => {
              if(!!res){
                  this.newAllegatoEvent.emit(res);
                  const updatedRecords = [...this.listaAllegati].concat([res]);
                  const upList = [...this.listAlleFiltered].concat([res])
                  this.listaAllegati = [...updatedRecords];
                  this.listAlleFiltered = [...upList];
                  this.changeDetectorRef.markForCheck();
              }
          }
      )
  }

  onClickEditAllegato(mode: string, veicolo:Veicolo, allegato:Allegato, atIndex): void {

      const data ={
          mode,
          istanza:this.istanza,
          docList: this.docList,
          typeDocuments: this.typeDocuments,
          veicolo,
          allegato
      }
      const ref : MatDialogRef<FormAllegatoVeicoloComponent> = this.dialog.open(FormAllegatoVeicoloComponent,{
          panelClass: 'dialog-responsive',
          disableClose: true,
          width:'60%',
          data
          //type: typeDocument
      })
      ref.afterClosed().subscribe(
          (res:Allegato) => {
              if(!!res){
                  this.newAllegatoEvent.emit(res);

                  const indexList = this.listaAllegati.findIndex(x=> x.id === res.id)
                  const updatedRecords = [...this.listaAllegati];
                  const upList = [...this.listAlleFiltered];
                  upList[atIndex] = res;
                  updatedRecords[indexList] = res;
                  this.listAlleFiltered = [...upList];
                  this.listaAllegati = [...updatedRecords];
                  this.changeDetectorRef.markForCheck();
              }
          }
      )
  }

  viewAllegato(file): void{

  this.service.getFile(file)
  .subscribe(
    {
     next:(res) => {
        const blob = new Blob([res],{type: file.type});
        const url = window.URL.createObjectURL(blob);
        const ref: MatDialogRef<PdfViewerSharedComponent> = this.dialog.open(PdfViewerSharedComponent,
            {
                data:{
                    url: url
                }
            }
        );
    },
        error: () => console.log('Error downloading the file.')
    });
  }


  downloadAllegato(file): void{

      this.service.getFile(file)
      .subscribe(
        {
          next:(res) => {
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
        error: () => console.log('Error downloading the file.')
        }

      );
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
                              this.listAlleFiltered = this.listAlleFiltered.filter((x) => x.id !== res.id && x.enable)
                              this.listaAllegati = this.listaAllegati.filter((x)=> x.id !== res.id && x.enable)
                          }
                      },
                      error:(err)=> console.log(err),
                      complete:()=>   this.changeDetectorRef.markForCheck()
                    }
                  )
              }
          })
  }


  checkAllegatoIntegrazione(allegato: Allegato){
   // console.log(allegato)
    let dataUpload = moment(Number(allegato.dataUpload))
   // console.log(this.rendicontazione.dateEnd)

    if(allegato.id_Report && dataUpload.isAfter(moment(Number(this.rendicontazione.dateEnd)))){
      if(this.istruttoriaData.typeReport['type'] === 'integrazione'){
        return 'Documento Integrazione'
      }
    }

  }

}
