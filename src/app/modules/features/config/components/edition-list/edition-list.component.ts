import { ConfigService } from '@app/modules/features/config/config.service';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '@app/modules/models/user.model';
import { debounceTime, Observable, Subscription, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationState } from '@app/app.state';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-edition-list',
  templateUrl: './edition-list.component.html',
  styleUrls: ['./edition-list.component.scss']
})
export class EditionListComponent implements OnInit , OnDestroy{
    displayedColumns: string[] = ['id', 'description', 'year', 'action'];


    user: Observable<User>;
    userMe: User;


    filters: FormGroup;
    filters$: Subscription;
    dataSource: TypeIstance[];

    paginator$: Subscription;

    timeScroll:any;
    isLoading: boolean = true;



    filterOptionsDescriptors: {
        [key: string]: any
    };
    constructor(
        private service: ConfigService,
        public paginator: PaginatorService,
        private store: Store<ApplicationState>,
        private changeDetectorRef: ChangeDetectorRef,

        private dialog: MatDialog,
    ) {
        this.user = this.store.pipe(select('authentication'),select('user'));
        this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);


        this.dataSource = [];
        this.timeScroll = null;
        this.filters = new FormGroup({
            term: new FormControl(null),
            role: new FormControl(null),
        });
     }

    ngOnInit() {
        this.createObservable();
        this.paginator.resetFilters();
    }
    ngOnDestroy(): void {
        this.filters$.unsubscribe();
        this.paginator$.unsubscribe()
    }

    createObservable(){
        this.filters$ = this.filters.valueChanges
        .pipe(debounceTime(400))
          .subscribe(
          (value: { [key: string]: string }) => {

            const filters = {};


              Object.keys(value).forEach(key => {


                  if (value[key] === undefined || value[key] === ''|| value[key] === null ) {
                      delete value[key] ;
                  }
              });

              this.dataSource = [];
              this.paginator.resetFilters(filters);
              this.changeDetectorRef.markForCheck();


        }
        );

        this.paginator$ = this.paginator
        .createStream(this.service.fetchTypeInstance.bind(this.service))
        .subscribe(
          {
           next: (records: TypeIstance[]) => this.handleSubscriptionResponse(records),
           error: (error: Error) => this.handleSubscriptionError(error)
          }
        );


      }
      private handleSubscriptionResponse(res: TypeIstance[]): void {
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

}
