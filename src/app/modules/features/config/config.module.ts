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
import { ListComponent } from './components/list/list.component';
import { ListTypeDocumentComponent } from './components/list-type-document/list-type-document.component';
import { ModalCategoryComponent } from './components/modal-category/modal-category.component';
import { ModalCertComponent } from './components/modal-cert/modal-cert.component';
import { ModalVeicoloComponent } from './components/modal-veicolo/modal-veicolo.component';
import { ReportComponent } from './components/report/report.component';
import { TypeDocResolver } from './resolvers/type-doc.resolver';
import {TypeIstanceResolver} from './resolvers/type-istance.resolver';
import { ConfigService } from './config.service';
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
    ListComponent,
    ListTypeDocumentComponent,
    ModalCategoryComponent,
    ModalCertComponent,
    ModalVeicoloComponent,
    ReportComponent
  ],
  providers: [ ConfigService, TypeIstanceResolver, TypeDocResolver]

})
export class ConfigModule { }
