import { ProjectsService } from './../../projects.service';
import { Desk } from '@app/modules/models/desk.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Employee } from '@app/modules/models/employee.model';
import { FitokData } from '@app/modules/models/fitokData.model';
import { Project } from '@app/modules/models/project.model';
import { Task } from '@app/modules/models/task.model';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})

export class TaskEditComponent implements OnInit {
  task: Task;
  project: Project;
  fitok: FitokData;
  typeOperations:{key: string, value:string}[];
  operators: Employee[];
  form: FormGroup;
  formInterval: FormGroup;
  formCheckList: FormGroup;
  btnSubmit: string;
  typeOperationData:[];
  deskData: Desk;
  mode: string;
  interval:{
    start?:number;
    end?:number;
    totalMin?: number
    problemcheck?:string;
    note?: string;
  }[];
  problemsCheck = [
    {value: 'break', viewValue: 'Pausa Operatori'},
    {value: 'endShift', viewValue: 'Fine Turno'},
    {value: 'deskIssue', viewValue: 'Imprevisto Banco'},
    {value: 'deskMaintenance', viewValue: 'Manutenzione Banco'},
    {value: 'priority', viewValue: 'Interruzione priorità'},

  ];

  minDate: Date;
  maxDate: Date;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<TaskEditComponent>,
                private dialog: MatDialog,
                private dateAdapter: DateAdapter<any>,
                private service: ProjectsService) {
                  this.dateAdapter.setLocale('it-IT');
                  this.fitok = data.fitok;
                  this.project = data.project;
                  this.task = data.task;
                  this.interval = this.task.interval? this.task.interval : [];
                  this.typeOperations = data.typeOperations;
                  this.operators = data.operators;
                  this.deskData = data.deskData;
                  this.mode = data.mode
                  console.log(data);
                  this.minDate = new Date(Number(this.task.datePlanStart));
                  this.maxDate = new Date(Number(this.task.datePlanEnd))
                  if(this.mode === 'edit'){
                    this.form = this.initializeForEdit(this.task);
                    this.formInterval = this.initializeForCreateInterval();
                    this.formCheckList = new FormGroup({});
                    this.task.checkList.map((item)=>this.formCheckList.addControl(item.type.toString(), new FormControl(false,[Validators.requiredTrue])));
                    this.createObservable()

                  }
                  if(this.mode === 'view'){
                    console.log(this.task, this.project)
                  }

                }

    ngOnInit(): void {

    }
    createObservable(){
      this.form.controls.dateStart.valueChanges.subscribe(
        (start) => {
          this.form.controls.dateEnd.setValue(start);
          this.formInterval.controls.dateStart.setValue(start);
          this.formInterval.controls.dateEnd.setValue(start);
        }
      )
    }
    onClickClose(){
      this.dialogRef.close()
    }
    initializeForEdit(task: Task): FormGroup{
      return new FormGroup({
        id: new FormControl(task.id),
        dateStart: new FormControl(task.dateStart?task.dateStart:null,[Validators.required]),
        dateEnd: new FormControl(task.dateEnd?task.dateEnd:null,[Validators.required]),
        timeStart: new FormControl(null,[Validators.required]),
        timeEnd: new FormControl(null,[Validators.required]),
      });
    }
    initializeForCreateInterval(): FormGroup{
      return new FormGroup({
        dateStart: new FormControl(null,[Validators.required]),
        dateEnd: new FormControl(null,[Validators.required]),
        timeStart: new FormControl(null,[Validators.required]),
        timeEnd: new FormControl(null,[Validators.required]),
        totalMin : new FormControl(null),
        problemcheck : new FormControl(null,[Validators.required]),
        note : new FormControl(null),
      })
    }
    initializeForEditCheckList(){

    }
    getTypeOperation(type){
      return this.typeOperations.find(x=> x.key === type)
    }
    getOperatorData(id){

      const data = this.operators.find(x=> x.id === id);
      return `${data.surname} ${data.name}`
    }
    onClickInsertInterval(){
      Object
      .keys(this.formInterval.controls)
      .map((key: string) => this.formInterval.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });
      if(this.formInterval.valid){
        const payload = this.formInterval.getRawValue();

        payload.start = new Date(payload.dateStart).setHours(parseInt(payload.timeStart.split(':')[0]),parseInt(payload.timeStart.split(':')[1]),0,0);
        payload.end= new Date(payload.dateEnd).setHours(parseInt(payload.timeEnd.split(':')[0]),parseInt(payload.timeEnd.split(':')[1]),0,0);
        payload.totalMin = (payload.end - payload.start);

        delete payload.dateStart;
        delete payload.dateEnd;
        delete payload.timeStart;
        delete payload.timeEnd;
        console.log(payload);

        const updatedRecords = [...this.interval].concat([payload])

        this.interval = [...updatedRecords];




      }
    }
    onClickSubmit(){
      Object
      .keys(this.form.controls)
      .map((key: string) => this.form.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });
      Object
      .keys(this.formCheckList.controls)
      .map((key: string) => this.formCheckList.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });
      console.log(this.form)
      if(this.form.valid){
        const payload = this.form.getRawValue();
        payload.dateStart = new Date(payload.dateStart).setHours(parseInt(payload.timeStart.split(':')[0]),parseInt(payload.timeStart.split(':')[1]),0,0);
        payload.dateEnd= new Date(payload.dateEnd).setHours(parseInt(payload.timeEnd.split(':')[0]),parseInt(payload.timeEnd.split(':')[1]),0,0);
        delete payload.timeStart;
        delete payload.timeEnd;
        payload.interval = this.interval;
        payload.status = 'completed';
        const payloadCheckList = this.formCheckList.getRawValue();
        this.task.checkList.map(
          (x) => {
              x.status = 'completed';
              x.start = new Date(Number(payload.dateStart)).getTime().toString()
              x.end = new Date(Number(payload.dateEnd)).getTime().toString()
          }
        )
        payload.ckeckList= this.task.checkList;
        let minPause = 0;
        this.interval.map(
          (p) => {
              let duration = (new Date(Number(p.end)).getTime() - new Date(Number(p.start)).getTime()) / 60000;
              minPause += duration;
          }
        )
        payload.workingDeskMinutes = ((payload.dateEnd - payload.dateStart) / 60000) - minPause;
        payload.workingOperatorsMinutes = payload.workingDeskMinutes * this.task.operators.length;
        console.log(payload);
        this.service.updateTask(payload).subscribe(
          (res)=> this.dialogRef.close(res)
        )

      }

  }

}
