import { ManagementRoutes } from './management.routes';
import { RouterModule } from '@angular/router';
import { ManagementService } from './management.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/modules/shared/shared.module';
import { DeskListComponent } from './components/desk-list/desk-list.component';
import { TranslationsModule } from '@app/modules/translations/translations.module';
import { DeskEditComponent } from './components/desk-edit/desk-edit.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyEditComponent } from './components/company-edit/company-edit.component';



@NgModule({
  declarations: [
    DeskListComponent,
    DeskEditComponent,
    CompanyListComponent,
    CompanyEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ManagementRoutes),
    TranslationsModule.forChild(),

  ],
  providers:[ManagementService]
})
export class ManagementModule { }
