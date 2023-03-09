import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';
import { PaginatorService } from './../../../../../services/paginator.service';
import { IstanzeService } from './../../../istanze.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Istanza, Rendicontazione } from '@app/modules/models/istanza.model';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { User } from '@app/modules/models/user.model';
import { debounceTime, Observable, Subscription, take } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationState } from '@app/app.state';
import { select, Store } from '@ngrx/store';
import { StorageService } from '@app/modules/services/storage.service';
import { DateAdapter } from '@angular/material/core';
import { ConfigService } from '@app/modules/features/config/config.service';

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
    'action'
    ];
  timeScroll:any;
  isLoading: boolean = true;
  breakpoint: number;

  filterOptionsDescriptors: {
      [key: string]: any
  };
    constructor(
                    private service: IstanzeService,
                    public paginator: PaginatorService,
                    private changeDetectorRef: ChangeDetectorRef,
                    private dialog: MatDialog,
                    private store: Store<ApplicationState>,
                    private storage: StorageService,
                    private dateAdapter: DateAdapter<any>,
                    private serviceConf: ConfigService,
    ) {
      this.dateAdapter.setLocale('it-IT');
      this.user = this.store.pipe(select('authentication'),select('user'));
      this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
      this.dataSource = [];
      this.timeScroll = null;
      this.rendstatus = [
        {value: null, view:'Tutti gli stati'},
        {value: 'enable', view:'Attiva'},
        {value: 'canceled', view:'Annullata'},
        {value: 'rend', view:'In Rendicontazione'},
        {value: 'closed', view:'Rendicontazione Chiusa'},


    ]
    this.type$ = this.serviceConf.fetchTypeInstance({drop:true}).subscribe(
      (x: TypeIstance[])=> this.type = x)
    this.filters = new FormGroup({
          term: new FormControl(null),
          type: new FormControl(null),
          list: new FormControl('true'),
          role: new FormControl(null),
          active: new FormControl(null),
          id_ram: new FormControl(null),
          statoIstanza: new FormControl(null)
      });


     }

    ngOnInit(): void {

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
        .subscribe(
            (records: Istanza[]) => this.handleSubscriptionResponse(records),
            (error: Error) => this.handleSubscriptionError(error)
        );
        this.paginator.resetFilters({list:'true'});
        this.service.countIstanze({total:'true'}).subscribe(
            (total) =>{ this.totRecord = total;this.changeDetectorRef.markForCheck();}
        )
    }
    ngOnDestroy(): void {
      this.filters$.unsubscribe()
      this.paginator$.unsubscribe()
      this.type$.unsubscribe()
    }
    private handleSubscriptionResponse(res: Istanza[]): void {
      console.log(res)
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

            console.log(e)
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
      const data = this.type.find(x=>x.id ===id)
     // console.log(data)
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

}
