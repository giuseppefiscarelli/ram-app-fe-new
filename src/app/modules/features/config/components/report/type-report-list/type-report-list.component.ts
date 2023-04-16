import { TypeReportEditComponent } from './../type-report-edit/type-report-edit.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { ConfigService } from '../../../config.service';

@Component({
  selector: 'app-type-report-list',
  templateUrl: './type-report-list.component.html',
  styleUrls: ['./type-report-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeReportListComponent implements OnInit {

  constructor(
    public paginator: PaginatorService,
    private changeDetectorRef: ChangeDetectorRef,
    private service: ConfigService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }
  onClickRecord(mode){
    const ref: MatDialogRef<TypeReportEditComponent> = this.dialog.open(TypeReportEditComponent,{
      width: '90%', data:{mode}
  });
  }

}
