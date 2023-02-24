import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { StampingEvent } from './../../../../models/stampingEvent.model';
import { Employee } from '@app/modules/models/employee.model';
import { Task } from '@app/modules/models/task.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
moment.locale('it');
@Component({
  selector: 'app-pause-dialog',
  templateUrl: './pause-dialog.component.html',
  styleUrls: ['./pause-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PauseDialogComponent implements OnInit {
  task: Task;
  operators: Employee[];
  stampingEvents : StampingEvent[];
  problemsCheck = [
    {value: 'break', viewValue: 'Pausa Operatori'},
    {value: 'endShift', viewValue: 'Fine Turno'},
    {value: 'deskIssue', viewValue: 'Imprevisto Banco'},
    {value: 'deskMaintenance', viewValue: 'Manutenzione Banco'},
    {value: 'priority', viewValue: 'Interruzione priorità'},

  ];
  form:FormGroup;
  inprogressTasks: any[];
  inprogressEmp: StampingEvent[];

  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
                private changeDetectorRef: ChangeDetectorRef,
                private dialogRef: MatDialogRef<PauseDialogComponent>,) {
                  this.inprogressEmp = [];
                  this.task = data.task;
                  this.inprogressTasks = this.task.checkList.filter(x=> x.status ==='inprogress');
                  this.stampingEvents = data.stampingEvents;
                  this.inprogressEmp = this.stampingEvents.filter(x=> x.start && !x.end);
                  this.operators = data.operators.filter((el) => {
                    return this.inprogressEmp.some((f) => {
                      return f.idDip === el.id ;
                    });
                  });
                  this.form = this.initializeForCreate();
   }

  ngOnInit(): void {
  }
  onClickSubmit(){
    Object
    .keys(this.form.controls)
    .map((key: string) => this.form.get(key))
    .forEach((control: AbstractControl) => {
        control.markAsDirty();
        control.markAsTouched();
    });

    if(this.form.valid){
      const payload = this.form.getRawValue();
      payload.start = new Date().getTime().toString();


      this.dialogRef.close(payload)


    }
  }
  initializeForCreate(): FormGroup{
    return new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
      totalMin: new FormControl(),
      problemcheck: new FormControl(),
      note: new FormControl(),
    })
  }
  getOperatorData(id){
      return this.operators.find(x=> x.id = id);
  }
  getDuration(time){
    let now = new Date().getTime();
    let refTime = new Date(Number(time)).getTime();
    let h = Math.floor(moment.duration(now - refTime).hours())
    let m = Math.floor(moment.duration(now - refTime).minutes())
    let hh = h < 10 ? '0'+ h: h;
    let mm = m < 10 ? '0'+ m: m;
    return `${hh}:${mm}`;
  }
  getStampData(idDip){
    const data = this.inprogressEmp.find(x=> x.idDip === idDip)
    return data;
  }


}
