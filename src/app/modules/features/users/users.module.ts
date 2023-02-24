import { TranslationsModule } from './../../translations/translations.module';
import { UsersRoutes } from './users.routes';
import { UsersService } from './users.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { SharedModule } from '@app/modules/shared/shared.module';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    ListComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    //MomentModule,
    TranslationsModule.forChild(),
    RouterModule.forChild(UsersRoutes),
  ],
  providers: [
    UsersService
  ]
})
export class UsersModule { }
