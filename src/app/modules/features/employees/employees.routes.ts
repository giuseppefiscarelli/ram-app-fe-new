import { EmployeePageComponent } from './components/employee-page/employee-page.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDashComponent } from './components/employee-dash/employee-dash.component';
import { Routes } from '@angular/router';
export const EmployeesRoutes: Routes = [
  {
      path:'',
      component: EmployeeDashComponent
  },
  {
      path:'list',
      component: EmployeeListComponent
  },
  {
      path:':id/page',
      component: EmployeePageComponent,
  }
]
