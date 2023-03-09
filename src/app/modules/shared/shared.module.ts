import {  PdfViewerSharedComponent } from './components/pdf-viewer/pdf-viewer.component';
import { RendStatusPipe } from './pipes/rendStatus.pipe';

import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { StatusTaskPipe } from './pipes/statusTask.pipe';
import { SharedService } from './shared.service';
import { FieldErrorsPipe } from './pipes/field.errors.pipe';
import { UserRolePipe } from './pipes/user.role.pipe';


import { MillisecondsToHours } from './pipes/millisecondToHours.pipe';
import { MinutesToHours } from './pipes/MinutesToHours.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MaterialModule } from '../material/material.module';

import { PriorityPipe } from './pipes/priority.pipe';
import { PhasePipe } from './pipes/phase.pipe';
import { TypeOperationPipe } from './pipes/type-operation.pipe';
import { PdfViewerModule,  } from 'ng2-pdf-viewer';
import { NgApexchartsModule } from "ng-apexcharts";


@NgModule({
  declarations: [
    MinutesToHours,
    PdfViewerSharedComponent,
    MillisecondsToHours,
    UserRolePipe,
    FieldErrorsPipe,
    StatusTaskPipe,
    PriorityPipe,
    PhasePipe,
    RendStatusPipe,
    TypeOperationPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    PdfViewerModule,
    NgApexchartsModule,








  ],
  exports:[
    CommonModule,
    ReactiveFormsModule,
    MinutesToHours,
    MillisecondsToHours,
    MaterialModule,
    FlexLayoutModule,
    UserRolePipe,
    FieldErrorsPipe,
    StatusTaskPipe,
    PriorityPipe,
    PhasePipe,
    PdfViewerSharedComponent,
    TypeOperationPipe,
    PdfViewerModule,
    NgApexchartsModule,
    RendStatusPipe


  ],
  providers:[SharedService]
})
export class SharedModule { }
