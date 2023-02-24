import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserRole } from '@app/app.costants';
import { SidenavComponent } from '@app/components/sidenav/sidenav.component';
import { User } from '@app/modules/models/user.model';
import { debounceTime, merge, Subscription } from 'rxjs';
import { UsersService } from '../../users.service';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers:[SidenavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit , OnDestroy{
  displayedColumns: string[] = ['id', 'fullname', 'email', 'role', 'enable','action'];
  start: number = 0;
  limit: number = 25;
  end: number = this.limit + this.start;
  filters: FormGroup;
  filters$: Subscription;
  dataSource: User[];
  timeScroll:any;
  isLoading: boolean = true;
  breakpoint: number;
  userData: User;

  filterOptionsDescriptors: {
      [key: string]: any
  };
    constructor(private service: UsersService,
                private changeDetectorRef: ChangeDetectorRef,
                private userD: SidenavComponent,
                private dialog: MatDialog,) {

                  this.userData = this.userD.userMe;
                  this.dataSource = [];
                  this.timeScroll = null;
                  this.filters = new FormGroup({
                      term: new FormControl(null),
                      offset: new FormControl(this.start),
                      role: new FormControl(null),
                      enable: new FormControl('true'),
                      limit: new FormControl(this.limit)
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
      const payload = {...this.filters.value};
      Object.keys(payload).forEach(key => {
          if (payload[key] === undefined || payload[key] === ''|| payload[key] === null ) {
              delete payload[key] ;
          }
      });
      this.getData(payload);
      this.createObservable();
    }
    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      this.filters$.unsubscribe();
    }

    createObservable(){
      this.filters$ = merge(
        this.filters.controls.role.valueChanges,
        this.filters.controls.term.valueChanges,
        this.filters.controls.enable.valueChanges,
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
            console.log(payload)
            this.dataSource = []
            this.getData(payload);

        }
    );
    }

    timeoutScroll(event){
      if(this.timeScroll){ clearTimeout(this.timeScroll);

        }
        this.timeScroll = setTimeout(() => {
            this.onTableScroll(event)
        }, 400);
    }

    updateIndex() {

        this.start = this.end;
        this.end = this.limit + this.start;
        this.filters.patchValue({offset: this.start,limit: this.limit});
    }

    onTableScroll(e) {

      const tableViewHeight = e.target.offsetHeight // viewport
      const tableScrollHeight = e.target.scrollHeight // length of all table
      const scrollLocation = e.target.scrollTop; // how far user scrolled

      // If the user has scrolled within 200px of the bottom, add more data
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
    getData(payload){
      this.service.fetch(payload).subscribe(
          (res: User[]) => {
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
              EditComponent,{disableClose: true,minWidth:'50%',data:{mode}}
            );
            break;

          default:
            break;
        }
    }


}
