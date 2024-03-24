import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationState } from '@app/app.state';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { User } from '@app/modules/models/user.model';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, debounceTime, distinct, distinctUntilChanged, first, forkJoin, from, groupBy, map, mergeMap, pluck, take, toArray } from 'rxjs';
import { ConfigService } from '../../../config.service';
import { Report } from '@app/modules/models/report.model';
import { MatTabGroup } from '@angular/material/tabs';
import { typeReport } from '@app/app.costants';
import { Allegato } from '@app/modules/models/allegato.model';
import { TypeReport } from '@app/modules/models/typeReport.model';
import Swal from 'sweetalert2';
import { IstanzeService } from '@app/modules/features/istanze/istanze.service';
import moment from 'moment';
import { TYPE } from '@app/modules/notifications/values.constants';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { AdminReportEditComponent } from '@app/modules/features/istanze/components/admin/admin-report-edit/admin-report-edit.component';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss'],
  providers:[IstanzeService]
})
export class ReportsListComponent implements OnInit, OnDestroy {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  displayedColumns: string[] = ['id','type','data',  'status', 'statusInvio', 'action'];

  user: Observable<User>;
  userMe: User;
  data$: Subscription;
  dialogData$: Subscription;
  filters: FormGroup;
  filters$: Subscription;
  dataSource: Report[];

  paginator$: Subscription;

  timeScroll:any;
  isLoading: boolean = true;
  typesReport: TypeReport [] = [];
  typesIstance: TypeIstance[] = [];
  totRecord: number =0;

  filterOptionsDescriptors: {
      [key: string]: any
  };
  constructor(
    private service: ConfigService,
    private istanzaService:IstanzeService,
    public paginator: PaginatorService,
    private store: Store<ApplicationState>,
    private changeDetectorRef: ChangeDetectorRef,
    private notifications: NotificationsComponent,


    private dialog: MatDialog,
  ) {
    this.user = this.store.pipe(select('authentication'),select('user'));
    this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);

    this.dataSource = [];
    this.timeScroll = null;
    this.filters = new FormGroup({
        term: new FormControl(null),
        enable: new FormControl('true'),
        status: new FormControl(null),
        statusInvio: new FormControl(null),
        typeReport: new FormControl(null),
    });
    this.filterOptionsDescriptors = {
      types: []
  };
    this.data$ = forkJoin([
      this.service.fetchTypeReport({drop:true}),
      this.service.fetchTypeInstance({drop:true}),


    ]).subscribe(
      ([types, typesIstance]) => {
        //types, typesIstance);
        this.typesReport = types;
        this.typesIstance= typesIstance;
        from(types).pipe(
          groupBy(obj => obj.type), // Raggruppo gli oggetti in base alla proprietà 'type'
          mergeMap(group => group.pipe(first())), // Seleziono solo il primo oggetto di ciascun gruppo
          toArray() // Converti nuovamente l'output in un array
      ).subscribe(distinctObjects => {
        this.filterOptionsDescriptors.types = distinctObjects;
      });


       // console.log(this.filterOptionsDescriptors.types)
      }
    )

   }

   ngOnInit() {
    this.createObservable();
   // this.paginator.resetFilters();

  //  this.service.countReport({total:'true'}).subscribe(
  //   (total) =>{
  //     this.totRecord = total;
  //    // this.changeDetectorRef.markForCheck();
  //   }

//)
    // Inizializza i filtri per la prima scheda
    this.setFilterValueForTab(0);
  }
  ngOnDestroy(): void {
      this.data$?.unsubscribe();
      this.dialogData$?.unsubscribe();
      this.filters$.unsubscribe();
      this.paginator$.unsubscribe();
  }
  tabChanged(event: any): void {
    this.isLoading = true;
    this.setFilterValueForTab(event.index);
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
  viewReport(data:Report){
    let file = data.fd;
    this.service.getFile(file)
    .subscribe(
      {
        next:(res) => {
       //   console.log(file)
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
        this.service.updateReport({
          id,
          status:'disabled',
          enable:false,
        }).subscribe({
          next:(res)=> {
            if(!!res){
              this.dataSource = this.dataSource.filter((x) => x.id !== res.id && x.enable)
            }
          },
          complete:()=> this.changeDetectorRef.markForCheck()
        })
      }
    });
  }
  setFilterValueForTab(tabIndex: number): void {
    switch (tabIndex) {
      case 0:
        this.filters.get('status').setValue('generated');
        this.filters.get('statusInvio').setValue(null);
        break;
      case 1:
        this.filters.get('status').setValue('prepared');
        this.filters.get('statusInvio').setValue('pending');
        break;
      case 2:
        this.filters.get('status').setValue('sent');
        this.filters.get('statusInvio').setValue('completed');
        break;
      default:
        break;
    }
  }
  createObservable(){
    this.filters$ = this.filters.valueChanges
    .pipe(debounceTime(400))
      .subscribe(
      (value: { [key: string]: string }) => {
       // console.log(value)
        const filters = {};


          Object.keys(value).forEach(key => {



            if (value[key] === undefined || value[key] === ''|| value[key] === null ) {
              delete value[key] ;
            }else{
              filters[key] = value[key]
            }
          });

          this.dataSource = [];
          this.paginator.resetFilters(filters);
          const payloadCount = filters;
          payloadCount['count'] = 'true';
          this.service.countReport(payloadCount).subscribe(
            (total) => {this.totRecord = total; this.changeDetectorRef.markForCheck();}
        )
          this.changeDetectorRef.markForCheck();


    }
    );

    this.paginator$ = this.paginator
    .createStream(this.service.fetchReport.bind(this.service))
    .subscribe(
      {
       next: (records: Report[]) => this.handleSubscriptionResponse(records),
       error: (error: Error) => this.handleSubscriptionError(error)
      }
    );


  }
  private handleSubscriptionResponse(res: Report []): void {
 //   console.log(res)
    this.paginator.pagination.offset === 0
        ? this.dataSource = res
        : this.dataSource = this.dataSource.concat(res);

    this.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  private handleSubscriptionError(error: Error): void {
      this.changeDetectorRef.markForCheck();
  }
  timeoutScroll(e){

    //e)
    if(this.timeScroll){ clearTimeout(this.timeScroll);

    }
    this.timeScroll = setTimeout(() => {
        const tableViewHeight = e.target.offsetHeight // viewport
        const tableScrollHeight = e.target.scrollHeight // length of all table
        const scrollLocation = e.target.scrollTop; // how far user scrolled

        // If the user has scrolled within 200px of the bottom, add more data
        const buffer = 200;
        const limit = tableScrollHeight - tableViewHeight - buffer;

        if (scrollLocation > limit && this.dataSource.length ) {
            this.paginator.nextPage();
        }
    }, 100);

  }
  onClickReport(mode, typeReport?:TypeReport, atIndex?,report?){

    let istanzaRef
    this.dialogData$ = forkJoin([
      this.istanzaService.getIstanza(report.idRam)
    ]).pipe(
      mergeMap(([istanza])=> {
   //     console.log(istanza)
        istanzaRef =istanza
        return forkJoin([
          this.istanzaService.fetchVeicoli({drop:true, id_ram: istanza.id_ram}),
          this.istanzaService.fetchAllegati({drop:true,id_ram: istanza.id_ram, enable:true}),
          this.service.fetchTypeDocuments({drop:true}),
        ])
      })
    ).subscribe(
      ([veicoli,allegati,typeDocuments]) => {
     //   console.log(veicoli,allegati,typeDocuments)
    //    console.log(this.typesIstance.find(x=>x.id === istanzaRef.tipo_istanza))
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
                reports: allegati,
                istanza:istanzaRef,
                typeInstance:this.typesIstance.find(x=>x.id === istanzaRef.tipo_istanza),
                veicoli:veicoli,
                typesDocuments:typeDocuments,
                listaAllegatiDich: allegati.filter(x=> x.typeDocument === 'ampl' || x.typeDocument === 'pmi' || x.typeDocument === 'rete'),
                listaAllegatiVeicoli: allegati.filter(x=> x.typeDocument !== 'ampl' && x.typeDocument !== 'pmi' && x.typeDocument !== 'rete')

            }
          })

          ref.afterClosed().subscribe(
            (res) => {
              if(!!res){
                if(mode === 'prepare'){
                  this.dataSource = this.dataSource.filter((x) => x.id !== res.id && x.enable)

                  this.changeDetectorRef.markForCheck();
                }else if(mode ==='edit' ){
                  const currentRecords = [...this.dataSource];
                  currentRecords[atIndex] = res;
                  this.dataSource = [...currentRecords];
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

               //   console.log(payloadReport)
                  this.service.updateReport(payloadReport).subscribe({
                    next:(res) => {
               //       console.log(res)
                      if(!!res){
                        this.dataSource = this.dataSource.filter((x) => x.id !== res.id && x.enable)
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
    )

  }

}
