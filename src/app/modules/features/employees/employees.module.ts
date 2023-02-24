import { EmployeesService } from './employees.service';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeePageComponent } from './components/employee-page/employee-page.component';
import { EmployeeDashComponent } from './components/employee-dash/employee-dash.component';
import { EmployeesRoutes } from './employees.routes';
import { TranslationsModule } from '@app/modules/translations/translations.module';


@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeePageComponent,
    EmployeeDashComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(EmployeesRoutes),
    TranslationsModule.forChild(),

  ],
  providers:[EmployeesService]
})
export class EmployeesModule { }
