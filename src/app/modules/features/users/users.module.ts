import { TranslationsModule } from './../../translations/translations.module';
import { UsersRoutes } from './users.routes';
import { UsersService } from './users.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { SharedModule } from '@app/modules/shared/shared.module';
import { RouterModule } from '@angular/router';
import { PaginatorService } from '@app/modules/services/paginator.service';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { QRCodeModule } from 'angularx-qrcode';




@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    MyProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
QRCodeModule,
    //MomentModule,
    TranslationsModule.forChild(),
    RouterModule.forChild(UsersRoutes),
  ],
  providers: [
    UsersService,
    PaginatorService,
  ]
})
export class UsersModule { }
