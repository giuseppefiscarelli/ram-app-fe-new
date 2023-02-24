import { FlexLayoutModule } from '@angular/flex-layout';
import { MonitoringService } from './monitoring.service';
import { MonitoringRoutes } from './monitoring.routes';

import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseEditComponent } from './phase-edit/phase-edit.component';
import { MaterialModule } from '@app/modules/material/material.module';
import {SharedModule} from '@modules/shared/shared.module';
import { PhaseListComponent } from './phase-list/phase-list.component';




@NgModule({
  declarations: [
    PhaseEditComponent,
    PhaseListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,

    FlexLayoutModule,
    RouterModule.forChild(MonitoringRoutes)
  ],
  providers:[MonitoringService]
})
export class MonitoringModule { }
