
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { StorageService } from './modules/services/storage.service';
import { MaterialModule } from './modules/material/material.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndexComponent } from './components/index/index.component';
import { RouterModule } from '@angular/router';
import {ApplicationRoutes} from '@app/app.routes';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {AuthenticationReducer} from './modules/store/reducers/authentication.reducer';
import {LoggedInGuard} from '@app/guards/logged.in.guard';
import {ApiModule} from '@modules/network/api.module';
import {UserRolePipe} from './pipes/user.role.pipe';

import { environment } from '../environments/environment'
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavbarComponent,
    SidenavComponent,
    UserRolePipe

  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    ApiModule,
    BrowserAnimationsModule,
    NotificationsModule.forRoot(),
    RouterModule.forRoot(ApplicationRoutes, {useHash: true}),
    FlexLayoutModule,
    TranslationsModule.forRoot(),
    FormsModule,
    StoreModule.forRoot({
            authentication: AuthenticationReducer
        }),


  ],
  providers: [
    StorageService, LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
