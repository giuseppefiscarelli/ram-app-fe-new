import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NotificationsComponent],
  exports:[NotificationsComponent]
})
export class NotificationsModule {

  static forRoot(): ModuleWithProviders<NotificationsModule> {
    return {
      ngModule: NotificationsModule,
      providers:[NotificationsComponent]
    }
  }
 }
