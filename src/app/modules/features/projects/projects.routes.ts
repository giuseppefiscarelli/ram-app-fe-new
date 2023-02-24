import { ProjectDashboardComponent } from './components/dashboards/project-dashboard/project-dashboard.component';
import { DeskDashboardComponent } from './components/dashboards/desk-dashboard/desk-dashboard.component';

import { FitokdataListComponent } from './components/fitokdata-list/fitokdata-list.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { ProjectDashComponent } from './components/project-dash/project-dash.component';
import { ProjectListComponent } from './components/project-list/project-list.component';

import { Routes, RouterModule } from '@angular/router';
import { MonitoringDashboardComponent } from './components/dashboards/monitoring-dashboard/monitoring-dashboard.component';

export const ProjectsRoutes: Routes = [
  { path:'list',component: ProjectListComponent},
  { path:'dash',component: ProjectDashComponent},
  { path:':/id/page',component: ProjectPageComponent, data:{mode:'view'}},
  { path:'fitok/list',component: FitokdataListComponent},
  { path:'dashboard',component: MonitoringDashboardComponent},
  { path:'dashboard/desk',component: DeskDashboardComponent},
  { path:'dashboard/project',component: ProjectDashboardComponent},
];


