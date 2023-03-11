import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserRole } from '@app/app.costants';
import { ApplicationState } from '@app/app.state';
import { SidenavComponent } from '@app/components/sidenav/sidenav.component';
import { User } from '@app/modules/models/user.model';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { select, Store } from '@ngrx/store';
import { debounceTime, merge, Observable, Subscription, take } from 'rxjs';
import { UsersService } from '../../users.service';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers:[],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit , OnDestroy{
  displayedColumns: string[] = ['id', 'fullname', 'email', 'role', 'action'];


  user: Observable<User>;
  userMe: User;


  filters: FormGroup;
  filters$: Subscription;
  dataSource: User[];

  paginator$: Subscription;

  timeScroll:any;
  isLoading: boolean = true;



  filterOptionsDescriptors: {
      [key: string]: any
  };
    constructor(private service: UsersService,
                public paginator: PaginatorService,
                private store: Store<ApplicationState>,
                private changeDetectorRef: ChangeDetectorRef,

                private dialog: MatDialog,) {
                  this.user = this.store.pipe(select('authentication'),select('user'));
                  this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);


                  this.dataSource = [];
                  this.timeScroll = null;
                  this.filters = new FormGroup({
                      term: new FormControl(null),

                      role: new FormControl(null),
                      enable: new FormControl('true'),

                  });
                  this.filterOptionsDescriptors = {
                      role: [
                          {title: 'all', value: null}
                      ]
                  };

                  Object.keys(UserRole)
                      .map((userRole: string) => (
                          this.filterOptionsDescriptors.role.push(
                              {
                                  title: UserRole[userRole],
                                  value: UserRole[userRole]
                              }
                          )
                      ));


                }

    ngOnInit(): void {


      this.createObservable();
      this.paginator.resetFilters();
    }
    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
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
      .createStream(this.service.fetch.bind(this.service))
      .subscribe(
        {
         next: (records: User[]) => this.handleSubscriptionResponse(records),
         error: (error: Error) => this.handleSubscriptionError(error)
        }
      );


    }
    private handleSubscriptionResponse(res: User[]): void {
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






    onClickEditBtn(mode, user?:User, atIndex?:number){
        switch (mode) {
          case 'create':
            const refCreate: MatDialogRef<EditComponent> = this.dialog.open(
              EditComponent, {disableClose: true,minWidth:'50%',data:{mode}}
            );
            refCreate.afterClosed().subscribe(
              (user: User) => {
                if(!!user){
                  const updatedRecords = [...this.dataSource].concat([user]);
                  this.dataSource = [...updatedRecords];
                  this.changeDetectorRef.markForCheck();
                }
              }
            );
            break;

          case 'edit':
             const refEdit: MatDialogRef<EditComponent> = this.dialog.open(
              EditComponent,{disableClose: true,minWidth:'50%',data:{mode,user}}
            );
            refEdit.afterClosed().subscribe(
              (updatedUser: User) => {
                  if (!!updatedUser) {
                      const currentRecords = [...this.dataSource];
                      currentRecords[atIndex] = updatedUser;

                      this.dataSource = [...currentRecords];
                      this.changeDetectorRef.markForCheck();
                  }
              }
          );

            break;

          default:
            break;
        }
    }


}
