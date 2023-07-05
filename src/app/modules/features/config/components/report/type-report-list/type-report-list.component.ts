import { TypeReportEditComponent } from './../type-report-edit/type-report-edit.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { ConfigService } from '../../../config.service';

import { FormGroup } from '@angular/forms';
import { User } from '@app/modules/models/user.model';
import { Observable, Subscription } from 'rxjs';
import { TypeReport } from '@app/modules/models/typeReport.model';

@Component({
  selector: 'app-type-report-list',
  templateUrl: './type-report-list.component.html',
  styleUrls: ['./type-report-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeReportListComponent implements OnInit {
  user: Observable<User>;
  userMe: User;
  dataSource: TypeReport[];

  filters: FormGroup;
  filters$: Subscription;
  displayedColumns: string[] = [
    'id',
    'description',
    'type',
    'typeistance',
    'action'
    ];
  timeScroll:any;
  paginator$: Subscription;

  constructor(
    public paginator: PaginatorService,
    private changeDetectorRef: ChangeDetectorRef,
    private service: ConfigService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {

    this.paginator$ = this.paginator
    .createStream(this.service.fetchTypeReport.bind(this.service))
    .subscribe(
      {
        next:(records: TypeReport[]) => this.handleSubscriptionResponse(records),
        error:(error: Error) => this.handleSubscriptionError(error)
      }
    );
    this.paginator.resetFilters();
  }
  private handleSubscriptionResponse(res: TypeReport[]): void {
    console.log(res)
    this.paginator.pagination.offset === 0
        ? this.dataSource = res
        : this.dataSource = this.dataSource.concat(res);

  //  this.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  private handleSubscriptionError(error: Error): void {
      this.changeDetectorRef.markForCheck();
  }
  onClickRecord(mode, record?:TypeReport, atIndex?:number){
        const ref: MatDialogRef<TypeReportEditComponent> = this.dialog.open(TypeReportEditComponent,{
          width: '90%', data:{
            mode,
            record
          }
         });
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
