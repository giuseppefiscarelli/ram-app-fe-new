import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MailConfig } from '@app/modules/models/mailConfig.model';
import { User } from '@app/modules/models/user.model';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { Observable, Subscription } from 'rxjs';
import { ConfigService } from '../../../config.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MailConfigEditComponent } from '../mail-config-edit/mail-config-edit.component';

@Component({
  selector: 'app-mail-config-list',
  templateUrl: './mail-config-list.component.html',
  styleUrls: ['./mail-config-list.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailConfigListComponent implements OnInit, OnDestroy {
  user: Observable<User>;
  userMe: User;
  filters: FormGroup;
  filters$: Subscription;
  dataSource: MailConfig[];

  displayedColumns: string[] = [
    'id',
    'user',
    'host',
    'port',
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

  ngOnInit(): void {
    this.paginator$ = this.paginator
    .createStream(this.service.fetchMailConfig.bind(this.service))
    .subscribe(
      {
        next:(records: MailConfig[]) => this.handleSubscriptionResponse(records),
        error:(error: Error) => this.handleSubscriptionError(error)
      }
    );
    this.paginator.resetFilters();
  }
  ngOnDestroy(): void {
      this.paginator$.unsubscribe()
      this.filters$?.unsubscribe()
  }
  private handleSubscriptionResponse(res: MailConfig[]): void {
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
  onClickRecord(mode, record?:MailConfig, atIndex?:number){
    const ref: MatDialogRef<MailConfigEditComponent> = this.dialog.open(MailConfigEditComponent,{
     // width: '90%',
      data:{
        mode,
        record
      }
     });
     ref.afterClosed().subscribe(
      (res: MailConfig) => {
        if(!!res){
          if(mode === 'create'){
            const updatedRecords = [...this.dataSource].concat([res]);
            this.dataSource = [...updatedRecords];
          }
          if(mode === 'edit'){
            const currentRecords = [...this.dataSource];
            currentRecords[atIndex] = res;
            this.dataSource = [...currentRecords];
          }
          this.changeDetectorRef.markForCheck();


          this.changeDetectorRef.markForCheck();
        }
      }
    );
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
