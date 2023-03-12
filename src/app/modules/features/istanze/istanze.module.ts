import { AdminIstanzaPageComponent } from './components/admin/admin-istanza-page/admin-istanza-page.component';
import { FormVeiComponent } from './components/user/form-vei/form-vei.component';
import { UserIstanzaEditComponent } from './components/user/user-istanza-edit/user-istanza-edit.component';
import { TypeDashComponent } from './components/home/type-dash/type-dash.component';
import { IstanzaCheckResolver } from './resolvers/istanzaCheck.resolver';
import { RendicontazioneResolver } from './resolvers/rendicontazione.resolver';
import { TypeIstanceResolver } from './../config/resolvers/type-istance.resolver';
import { MyIstanzaResolver } from './resolvers/myIstanza.resolver';
import { IstanzaResolver } from './resolvers/istanza.resolver';
import { IstanzeService } from './istanze.service';
import { IstanzeRoutes } from './istanze.routes';
import { IstanzaHomeComponent } from './components/home/istanza-home/istanza-home.component';
import { NgModule } from '@angular/core';

import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/modules/material/material.module';
import { SharedModule } from '@app/modules/shared/shared.module';
import { TranslationsModule } from '@app/modules/translations/translations.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MomentModule } from 'ngx-moment';
import { AdminIstanzeListComponent } from './components/admin/admin-istanze-list/admin-istanze-list.component';
import { CancelDialogComponent } from './components/admin/cancel-dialog/cancel-dialog.component';
import { FormAllegatoComponent } from './components/user/form-allegato/form-allegato.component';
import { FormAllegatoVeicoloComponent } from './components/user/form-allegato-veicolo/form-allegato-veicolo.component';
import { ContentVeiComponent } from './components/user/content-vei/content-vei.component';
import { AdminDialogAllegatoComponent } from './components/admin/admin-dialog-allegato/admin-dialog-allegato.component';
import { AdminVeicoloDialogComponent } from './components/admin/admin-veicolo-dialog/admin-veicolo-dialog.component';
import { CheckCertDialogComponent } from './components/admin/check-cert-dialog/check-cert-dialog.component';

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
    PdfViewerModule,
    TranslationsModule.forChild(),
    RouterModule.forChild(IstanzeRoutes),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  declarations: [
    IstanzaHomeComponent,
    TypeDashComponent,
    AdminIstanzeListComponent,
    CancelDialogComponent,
    UserIstanzaEditComponent,
    FormAllegatoComponent,
    FormAllegatoVeicoloComponent,
    ContentVeiComponent,
    FormVeiComponent,
    AdminIstanzaPageComponent,
    AdminDialogAllegatoComponent,
    AdminVeicoloDialogComponent,
    CheckCertDialogComponent
  ],
  providers : [IstanzeService, IstanzaResolver, MyIstanzaResolver, TypeIstanceResolver, RendicontazioneResolver, IstanzaCheckResolver]

})
export class IstanzeModule { }
