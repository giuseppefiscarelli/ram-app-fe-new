import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationState } from '@app/app.state';
import { TypeDocument } from '@app/modules/models/typeDocument.model';
import { User } from '@app/modules/models/user.model';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { Store } from '@ngrx/store';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { ConfigService } from '../../config.service';
import { EditTypeDocumentComponent } from '../edit-type-document/edit-type-document.component';

@Component({
  selector: 'app-list-type-document',
  templateUrl: './list-type-document.component.html',
  styleUrls: ['./list-type-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTypeDocumentComponent implements OnInit {
  user: Observable<User>;
  userMe: User;
  dataSource: TypeDocument[];

  filters: FormGroup;
  filters$: Subscription;

  displayedColumns: string[] = [
    'id',
    'des',
    'upload',
    'required',
    'action'
    ];
  timeScroll:any;
  paginator$: Subscription;

  isLoading: boolean = true;
    constructor(
      public paginator: PaginatorService,
      private changeDetectorRef: ChangeDetectorRef,
      private store: Store<ApplicationState>,
      private service: ConfigService,
      private dialog: MatDialog,
    ) { }

    ngOnInit(): void {

      this.paginator$ = this.paginator
          .createStream(this.service.fetchTypeDocuments.bind(this.service))
          .subscribe(
            {
              next:(records: TypeDocument[]) => this.handleSubscriptionResponse(records),
              error:(error: Error) => this.handleSubscriptionError(error)
            }
          );
      this.paginator.resetFilters();
    }
    private handleSubscriptionResponse(res: TypeDocument[]): void {
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

    onClickRecord(mode, record?:TypeDocument, atIndex?: number): void{



      let data = {};
      if(mode === 'create'){
          data = {
              mode: mode,

          }
      }
      if (mode === 'edit'){
          data = {
              mode: mode,
              record
          }
      }
      const ref: MatDialogRef<EditTypeDocumentComponent> = this.dialog.open(EditTypeDocumentComponent,{
          panelClass: 'dialog-responsive', data: data
      });
      ref.afterClosed().subscribe(
          (updateRecord: TypeDocument)=>{
              if(!!updateRecord) {
                  if(mode === 'create'){
                      const updatedRecords = [...this.dataSource].concat([updateRecord]);
                      this.dataSource = [...updatedRecords];
                  }
                  if(mode === 'edit'){
                    const currentRecords = [...this.dataSource];
                      currentRecords[atIndex] = updateRecord;

                      this.dataSource = [...currentRecords];
                }

                  this.changeDetectorRef.markForCheck();
              }
          }
      )
  }


}
