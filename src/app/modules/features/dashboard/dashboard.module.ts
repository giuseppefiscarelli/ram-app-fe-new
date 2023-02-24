import { NgApexchartsModule } from 'ng-apexcharts';
import { FitokDialogComponent } from './tablet/fitok-dialog/fitok-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashTestComponent } from './dash-test/dash-test.component';
import { RouterModule } from '@angular/router';


import { DashBoardRoutes } from './dashboard.routes';
import { SharedModule } from '@app/modules/shared/shared.module';
import { TranslationsModule } from '@app/modules/translations/translations.module';
import { TabletDashboardComponent } from './tablet-dashboard/tablet-dashboard.component';
import { DetailFitokComponent } from './tablet/detail-fitok/detail-fitok.component';
import { ChecklistDialogComponent } from './tablet/checklist-dialog/checklist-dialog.component';
import { ControlHomeComponent } from './control-room/control-home/control-home.component';
import { TypeoperationDialogComponent } from './tablet/typeoperation-dialog/typeoperation-dialog.component';
import { PauseDialogComponent } from './tablet/pause-dialog/pause-dialog.component';
import { DashboardBackofficeComponent } from './backoffice/dashboard-backoffice/dashboard-backoffice.component';
import { TestChartAComponent } from './backoffice/test-chart-a/test-chart-a.component';
import { TestChartBComponent } from './backoffice/test-chart-b/test-chart-b.component';
import { TestChartCComponent } from './backoffice/test-chart-c/test-chart-c.component';
@NgModule({
  declarations: [
    DashTestComponent,
    TabletDashboardComponent,
    DetailFitokComponent,
    FitokDialogComponent,
    ChecklistDialogComponent,
    ControlHomeComponent,
    TypeoperationDialogComponent,
    PauseDialogComponent,
    DashboardBackofficeComponent,
    TestChartAComponent,
    TestChartBComponent,
    TestChartCComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashBoardRoutes),
    SharedModule,
    NgApexchartsModule,
    TranslationsModule.forChild(),
  ]
})
export class DashboardModule { }
