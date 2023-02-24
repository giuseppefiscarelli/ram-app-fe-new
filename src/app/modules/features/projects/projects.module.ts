import { MaterialModule } from '@app/modules/material/material.module';
import { MonitoringDashboardComponent } from './components/dashboards/monitoring-dashboard/monitoring-dashboard.component';

import { ProjectsService } from './projects.service';
import { SharedModule } from '@app/modules/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { ProjectDashComponent } from './components/project-dash/project-dash.component';
import { RouterModule } from '@angular/router';
import { ProjectsRoutes } from './projects.routes';
import { TranslationsModule } from '@app/modules/translations/translations.module';
import { FitokdataListComponent } from './components/fitokdata-list/fitokdata-list.component';
import { FitokdataViewComponent } from './components/fitokdata-view/fitokdata-view.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { TaskCardComponent } from './components/dashboards/task-card/task-card.component';
import { DeskDashboardComponent } from './components/dashboards/desk-dashboard/desk-dashboard.component';
import { DeskCardComponent } from './components/dashboards/desk-card/desk-card.component';
import { ProjectDashboardComponent } from './components/dashboards/project-dashboard/project-dashboard.component';
import { ProjectCardComponent } from './components/dashboards/project-card/project-card.component';
import { PdfViewProjectComponent } from './components/common/pdf-view-project/pdf-view-project.component';
import { ProjectMultilineChartComponent } from './components/dashboards/project-multiline-chart/project-multiline-chart.component';


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectPageComponent,
    ProjectEditComponent,
    ProjectDashComponent,
    FitokdataListComponent,
    FitokdataViewComponent,
    TaskEditComponent,
    MonitoringDashboardComponent,
    TaskCardComponent,
    DeskDashboardComponent,
    DeskCardComponent,
    ProjectDashboardComponent,
    ProjectCardComponent,
    PdfViewProjectComponent,
    ProjectMultilineChartComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(ProjectsRoutes),
    TranslationsModule.forChild(),

  ],
  providers:[ProjectsService]
})
export class ProjectsModule { }
