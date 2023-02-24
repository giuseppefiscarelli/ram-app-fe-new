import { IndexComponent } from './components/index/index.component';

import {Routes} from '@angular/router';
import { LoggedInGuard } from './guards/logged.in.guard';


export const ApplicationRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/features/authentication/authentication.module').then(exports => exports.AuthenticationModule)
  },
  {

  path:'',
  canActivate: [LoggedInGuard],
  component: IndexComponent,
  children: [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
    },
    {path: 'dashboard',loadChildren: () => import('./modules/features/dashboard/dashboard.module').then(exports => exports.DashboardModule)},
    {path: 'monitoring',loadChildren: () => import('./modules/features/monitoring/monitoring.module').then(exports => exports.MonitoringModule)},
    {path: 'users', loadChildren: () => import('./modules/features/users/users.module').then(exports => exports.UsersModule)},
    {path: 'management',loadChildren: () => import('./modules/features/management/management.module').then(exports => exports.ManagementModule)},
    {path: 'projects',loadChildren: () => import('./modules/features/projects/projects.module').then(exports => exports.ProjectsModule)},
    {path: 'employees',loadChildren: () => import('./modules/features/employees/employees.module').then(exports => exports.EmployeesModule)
  },

  ]

}]
