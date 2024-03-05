import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';
import { PaginatorService } from './../../../../../services/paginator.service';
import { IstanzeService } from './../../../istanze.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Istanza, Rendicontazione } from '@app/modules/models/istanza.model';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { User } from '@app/modules/models/user.model';
import { debounceTime, filter, Observable, Subscription, take, forkJoin } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationState } from '@app/app.state';
import { select, Store } from '@ngrx/store';
import { StorageService } from '@app/modules/services/storage.service';
import { DateAdapter } from '@angular/material/core';
import { ConfigService } from '@app/modules/features/config/config.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { TypeReport } from '@app/modules/models/typeReport.model';
import moment from 'moment';

@Component({
  selector: 'app-admin-istanze-list',
  templateUrl: './admin-istanze-list.component.html',
  styleUrls: ['./admin-istanze-list.component.scss'],
  providers:[PaginatorService,ConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AdminIstanzeListComponent implements OnInit , OnDestroy{
  user: Observable<User>;
  userMe: User;
  dataSource: Istanza[];

  filters: FormGroup;
  filters$: Subscription;

  type:TypeIstance[];
  typeReports: TypeReport[]=[];
  type$: Subscription;
  rendstatus:any[];
  totRecord: number;

  paginator$: Subscription;

  displayedColumns: string[] = [
    'edition',
    'idram',
    'dateSend',
    'businessName',
    'pecImpresa',
    'status',
    'istrStatus',
    'action'
    ];
  timeScroll:any;
  isLoading: boolean = true;
  breakpoint: number;

  filterOptionsDescriptors: {
      [key: string]: any
  };
  today: Date;
  routerSubscription$: Subscription;
    constructor(
                    private service: IstanzeService,
                    public paginator: PaginatorService,
                    private router: Router,
                    private route: ActivatedRoute,
                    private changeDetectorRef: ChangeDetectorRef,
                    private dialog: MatDialog,
                    private store: Store<ApplicationState>,
                    private storage: StorageService,
                    private dateAdapter: DateAdapter<any>,
                    private serviceConf: ConfigService,
    ) {
      this.dateAdapter.setLocale('it-IT');
      this.today = new Date();
      this.today = new Date();
      this.user = this.store.pipe(select('authentication'),select('user'));
      this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
      this.dataSource = [];
      this.type = [];
      this.type = [];
      this.timeScroll = null;
      this.rendstatus = [
        {value: null, view:'Tutti gli stati'},
        {value: 'enable', view:'Attiva'},
        {value: 'canceled', view:'Annullata'},
        {value: 'rend', view:'In Rendicontazione'},
        {value: 'closed', view:'Rendicontazione Chiusa'},
        {value: 'expired', view:'Scaduta'},


      ];
      this.filterOptionsDescriptors = {
        statusIstance: [
            {title: 'Tutti', value: null},
            {title: 'In lavorazione', value: 'true'}
        ]
    };
    this.routerSubscription$ = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {

      const targetRoute = event.url;
      if(!targetRoute.startsWith('/istanze/admin/')){
        localStorage.removeItem('filters');
      }
    });
    this.type$ = forkJoin([
      this.serviceConf.fetchTypeInstance({drop:true}),
      this.serviceConf.fetchTypeReport({drop:true})
    ]).subscribe(
      ([x,typesReport])=> {
        this.type = x;
        this.typeReports = typesReport;
        console.log(this.typeReports);
        this.isLoading = false;
        this.changeDetectorRef.markForCheck()
      })
    this.filters = new FormGroup({
          term: new FormControl(null),
          type: new FormControl(null),
          list: new FormControl('true'),
          role: new FormControl(null),
          istrActive :new FormControl(null),
          active: new FormControl(null),
          id_ram: new FormControl(null),
          statoIstanza: new FormControl(null)
      });


     }

    ngOnInit(): void {

        this.service.countIstanze({total:'true'}).subscribe(
            (total) =>{
              this.totRecord = total;
             // this.changeDetectorRef.markForCheck();
            }
        )
        this.createObservable()


        this.route.queryParams.subscribe(params => {
          //console.log(params)

        });
        const filters = JSON.parse(localStorage.getItem('filters'));
       // console.log(filters)
       // console.log(filters)
        if(filters){
          //this.paginator.resetFilters(filters);
          this.filters.setValue(filters)
        }else{
          this.paginator.resetFilters({list:'true'});
        }
    }

    createObservable(){
      this.filters$ = this.filters.valueChanges
      .pipe(debounceTime(400))
      .subscribe(
          (value: { [key: string]: string }) => {
              const filters = {};
              this.totRecord = 0;
              Object.keys(value)
                  .forEach((key: string) => {
                      if(key ==='statoIstanza'){
                          switch (value[key]) {
                              case 'enable':filters['active'] = 'true';break;
                              case 'rend': filters['rend'] = 'rendEnable';break;
                              case 'canceled': filters['rend'] = 'rendCanceled';break;
                              case 'closed': filters['rend'] = 'rendClosed';break;
                              case 'expired': filters['rend'] = 'rendExpired';break;
                          }
                      }else{
                          filters[key] = value[key]
                      }
                      if (value[key] === undefined || value[key] === ''|| value[key] === null ) {
                          delete filters[key] ;
                      }


                  });

              this.dataSource = [];
              this.paginator.resetFilters(filters);
              const payloadCount = filters;
              delete payloadCount['list'];
              payloadCount['total'] = 'true';
              this.service.countIstanze(payloadCount).subscribe(
                  (total) => {this.totRecord = total; this.changeDetectorRef.markForCheck();}
              )
              this.changeDetectorRef.markForCheck();

          }
      );

      this.paginator$ = this.paginator
      .createStream(this.service.fetchIstanze.bind(this.service))
      .subscribe({

          next:(records: Istanza[]) => this.handleSubscriptionResponse(records),
          error:(error: Error) => this.handleSubscriptionError(error)
      });
    }
    ngOnDestroy(): void {
      this.filters$.unsubscribe()
      this.paginator$.unsubscribe()
      this.type$.unsubscribe()
      this.routerSubscription$.unsubscribe()
    }
    private handleSubscriptionResponse(res: Istanza[]): void {
     // console.log(res)
      this.paginator.pagination.offset === 0
          ? this.dataSource = res
          : this.dataSource = this.dataSource.concat(res);

      //this.isLoading = false;
      this.changeDetectorRef.markForCheck();
    }
    private handleSubscriptionError(error: Error): void {
        this.changeDetectorRef.markForCheck();
    }
    timeoutScroll(e){

       //     console.log(e)
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

    getInfoEdizione(id){
      const data =this.type.length>0? this.type.find(x=>x.id ===id):{description:'',year:''}
     // console.log(data)
     this.changeDetectorRef.markForCheck()
      return `${data.description} - ${data.year}`
    }

    onClickCancelIstanza(istanza,index,mode){
      const ref: MatDialogRef<CancelDialogComponent> = this.dialog.open( CancelDialogComponent,{
          disableClose: true,
          data:{
              istanza,
              mode

          }

      });
      ref.afterClosed().subscribe(

          (res:Rendicontazione)=> {
              if(!!res){

                  const currentRecords = [...this.dataSource];
                  currentRecords[index]['rendstatus'] = 'canceled';

                  this.dataSource = [...currentRecords];
                  this.changeDetectorRef.markForCheck();
              }
          }
      )
    }
    getStatusIstruttoria(element){
      //console.log(element)
      let data = {
        text: 'In Rendicontazione',
        style: 'closed',
        status: 'rend'
      }
      if(element.statusreport){
        let type = this.typeReports.find(x=> x.id === element.typereport);
       // console.log(type, this.typeReports)
       // console.log(type)
      // console.log(element.datainvioreport)
      //    console.log(moment(Number(element.datainvioreport)))
          if(element.datainvioreport && type && (moment() < moment(Number(element.datainvioreport)).add(15,'days'))){
            data = {
              text: type.description + ' - Attiva',
              style:  element.statusreport,
              status: element.statusreport
            }

          // console.log(type)
          }else{
            data = {
              text: type.description,
              style:  element.statusreport,
              status: element.statusreport
            }
          }



      }else{
        if(element.rendstatus === 'closed'){
          if(element.istaupdated > element.istacreated){
            data = {
              text: 'In Lavorazione',
              style: 'opened',
              status:'work'
            }
          }else if(element.istaupdated === element.istacreated){
            data = {
              text: 'In Lavorazione',
              style: 'pending',
              status:'pending'
            }
          }
        }
      }


      //console.log(data)
      return data
    }

    getStatusRendicontazione(element){

      let spanData :any ={

      }
      const isExpired = Number(element.reportingenddate) < this.today.getTime()

      if(element){

        if(element.rendstatus){


          if(element.rendstatus === 'pending'){
            spanData.status = element.rendstatus;
            spanData.pData ='avviata il :';
            spanData.date = element.daterendstart
          }
          if(element.rendstatus === 'opened'){
            spanData.status = element.rendstatus;
            spanData.pData ='avviata il :';
            spanData.date = element.daterendstart
          }
          if(isExpired){
            spanData.status = 'expired';
            spanData.pData ='scaduta il :';
            spanData.date = element.reportingenddate
          }
          if(element.rendstatus === 'closed'){
            spanData.status = element.rendstatus;
            spanData.pData ='chiusa il :';
            spanData.date = element.dateend
          }
          if(element.rendstatus === 'canceled'){
            spanData.status = element.rendstatus;
            spanData.pData ='annullata il :';
            spanData.date = element.datecanceled
          }
        }else{


            if(isExpired){
              spanData.status = 'expired';
              spanData.pData ='scaduta il :';
              spanData.date = element.reportingenddate
            }else{
              spanData.status = 'pending';
              spanData.pData ='';
              spanData.date = null;
            }
        }
      }

      return spanData



    }
    goToIstanza(id){
      localStorage.setItem('filters', JSON.stringify(this.filters.getRawValue()));

      this.router.navigate(['/istanze', 'admin', id]);
    }

}
