import { ManagementService } from './../../management.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SidenavComponent } from '@app/components/sidenav/sidenav.component';
import { Desk } from '@app/modules/models/desk.model';
import { User } from '@app/modules/models/user.model';
import { debounceTime, merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-desk-list',
  templateUrl: './desk-list.component.html',
  styleUrls: ['./desk-list.component.scss'],
  providers:[SidenavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeskListComponent implements OnInit , OnDestroy{
  userData: User;
  dataSource: Desk[];
  start: number = 0;
  limit: number = 25;
  filters: FormGroup;
  filters$: Subscription;
  data$: Subscription;
  end: number = this.limit + this.start;

  displayedColumns: string[] = ['id', 'name', 'code', 'phase', 'action'];
  timeScroll:any;
  isLoading: boolean = true;


    constructor(  private service: ManagementService,
                  private user: SidenavComponent,
                  private changeDetectorRef: ChangeDetectorRef) {
                    this.userData = this.user.userMe;
                    this.timeScroll = null;
                    this.dataSource = [];
                    this.filters = new FormGroup({
                        term: new FormControl(null),
                        offset: new FormControl(this.start),
                        enable: new FormControl('true'),
                        limit: new FormControl(this.limit)
                    });
                   }

    ngOnInit(): void {
      const payload = {...this.filters.value};
      Object.keys(payload).forEach(key => {
          if (payload[key] === undefined || payload[key] === ''|| payload[key] === null ) {
              delete payload[key] ;
          }
      });
      this.getData(payload);
      this.filterObservable();
    }
    ngOnDestroy(): void {
      this.filters$.unsubscribe();

    }

    filterObservable():void{
      this.filters$ = merge(
        this.filters.controls.term.valueChanges,
       )
       .pipe(debounceTime(400))
       .subscribe(
        (value) => {
            this.start = 0;
            this.limit = 25;
            this.end =  this.limit + this.start;
            this.filters.controls.offset.setValue(this.start)
            this.filters.controls.limit.setValue(this.limit)
            const payload = {...this.filters.value};
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || payload[key] === ''|| payload[key] === null ) {
                    delete payload[key] ;
                }
            });
            this.dataSource = []
            this.getData(payload);

        }
    );
    }
    getData(payload){
      this.service.fetchDesk(payload).subscribe(
          (res: Desk[]) => {

              if(res && res.length > 0){
                  let data = res;
                  this.dataSource = this.dataSource.concat(data);
                  this.isLoading = false;
                  this.updateIndex();
                  this.changeDetectorRef.markForCheck();
              }

          }
      )
    }
    updateIndex() {

      this.start = this.end;
      this.end = this.limit + this.start;
      this.filters.patchValue({offset: this.start,limit: this.limit});
    }
    timeoutScroll(event){
      if(this.timeScroll){ clearTimeout(this.timeScroll);

      }
      this.timeScroll = setTimeout(() => {
          this.onTableScroll(event)
      }, 400);
    }
    onTableScroll(e) {

      const tableViewHeight = e.target.offsetHeight // viewport
      const tableScrollHeight = e.target.scrollHeight // length of all table
      const scrollLocation = e.target.scrollTop; // how far user scrolled
      const buffer = 100;
      const limit = tableScrollHeight - tableViewHeight - buffer;
      const payload = this.filters.value;
      Object.keys(payload).forEach(key => {
          if (payload[key] === undefined || payload[key] === ''|| payload[key] === null ) {
              delete payload[key] ;
          }
      });
      if (scrollLocation > limit && this.dataSource.length == this.start) {
          this.getData(payload);
      }
    }

    onClickEditBtn(mode, element?:Desk, atIndex?:number){

    }

}
