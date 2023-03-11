import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { EditionEditComponent } from './components/edition-edit/edition-edit.component';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { EditionListComponent } from './components/edition-list/edition-list.component';
import { TranslationsModule } from '@app/modules/translations/translations.module';
import { SharedModule } from '@app/modules/shared/shared.module';
import { MaterialModule } from '@app/modules/material/material.module';

import { NgxCurrencyModule, CurrencyMaskInputMode } from 'ngx-currency';
import { NgxMatTimepickerModule  } from 'ngx-mat-timepicker';
import { ConfigRoutes } from './config.routes';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'ngx-moment';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './components/edit/edit.component';
import { EditTypeDocumentComponent } from './components/edit-type-document/edit-type-document.component';

import { ListTypeDocumentComponent } from './components/list-type-document/list-type-document.component';
import { ModalCategoryComponent } from './components/modal-category/modal-category.component';
import { ModalCertComponent } from './components/modal-cert/modal-cert.component';
import { ModalVeicoloComponent } from './components/modal-veicolo/modal-veicolo.component';
import { ReportComponent } from './components/report/report.component';
import { TypeDocResolver } from './resolvers/type-doc.resolver';
import {TypeIstanceResolver} from './resolvers/type-istance.resolver';
import { ConfigService } from './config.service';
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker/public-api';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.NATURAL
};
@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    MomentModule,
    TranslationsModule.forChild(),
    RouterModule.forChild(ConfigRoutes),
    NgxMatTimepickerModule,

    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  declarations: [
    EditComponent,
    EditTypeDocumentComponent,
    EditionListComponent,
    ListTypeDocumentComponent,
    ModalCategoryComponent,
    ModalCertComponent,
    ModalVeicoloComponent,
    ReportComponent,
    EditionEditComponent,
    ConfigPanelComponent
  ],
  providers: [ ConfigService, TypeIstanceResolver, TypeDocResolver, PaginatorService]

})
export class ConfigModule { }
