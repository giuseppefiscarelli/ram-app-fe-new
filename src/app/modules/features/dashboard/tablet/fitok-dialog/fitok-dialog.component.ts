import { Task } from '@app/modules/models/task.model';
import { NotificationsModule } from './../../../../notifications/notifications.module';
import { StampingEvent } from './../../../../models/stampingEvent.model';
import { Employee } from './../../../../models/employee.model';
import { EmployeesService } from '@app/modules/features/employees/employees.service';
import { ChecklistDialogComponent } from './../checklist-dialog/checklist-dialog.component';
import { forkJoin } from 'rxjs';
import { ProjectsService } from './../../../projects/projects.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';


import { FitokData } from './../../../../models/fitokData.model';
import { Project } from '@app/modules/models/project.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TypeoperationDialogComponent } from '../typeoperation-dialog/typeoperation-dialog.component';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { TYPE } from '@app/modules/notifications/values.constants';
import { PauseDialogComponent } from '../pause-dialog/pause-dialog.component';
import { PdfViewProjectComponent } from '@app/modules/features/projects/components/common/pdf-view-project/pdf-view-project.component';


@Component({
  selector: 'app-fitok-dialog',
  templateUrl: './fitok-dialog.component.html',
  styleUrls: ['./fitok-dialog.component.scss'],
  providers:[ProjectsService, EmployeesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FitokDialogComponent implements OnInit {
  mode: string;
  task: Task;
  tasks: Task[];
  project: Project;
  fitok: FitokData;
  typeOperation:{key: string, value:string}[];
  operators: Employee[];
  formTask: FormGroup;
  btnSubmit: string;
  typeOperationData:[]
  stampingEvents: StampingEvent[];
  stampingListView:boolean;
  problemsCheck = [
    {value: 'break', viewValue: 'Pausa Operatori'},
    {value: 'endShift', viewValue: 'Fine Turno'},
    {value: 'deskIssue', viewValue: 'Imprevisto Banco'},
    {value: 'deskMaintenance', viewValue: 'Manutenzione Banco'},
    {value: 'priority', viewValue: 'Interruzione priorità'},

  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private projectService: ProjectsService,
              private empService: EmployeesService,
              private dialogRef: MatDialogRef<FitokDialogComponent>,
              private dialog: MatDialog,
              private notification: NotificationsComponent,
              private changeDetectorRef: ChangeDetectorRef,
              ) {
                this.mode = null;
                this.tasks = [];
                this.stampingEvents = [];
                this.stampingListView = false;
                this.fitok = data.fitok;
                this.project = data.project;
                this.task = data.task;
                this.typeOperation = data.typeOperation;
                this.operators = data.operators;
                this.onChangeStatus(this.task.status);
   // console.log(this.task)

  }

  ngOnInit() {
  }
  viewFile(url): void{

    const ref: MatDialogRef<PdfViewProjectComponent> = this.dialog.open(PdfViewProjectComponent,{
      disableClose: true,
      width:'70%',
      height:'95%',
      maxWidth: '95vw',
      maxHeight: '85vh',
      data: {
        url,
        attachData: this.project.attachData
      }
    })
    ref.afterClosed().subscribe(
      (res)=> {
        if(res){
          this.project.attachData = res;
          this.projectService.updateProject(this.project).subscribe(
            (res)=> {
              this.notification.toast(TYPE.SUCCESS,'Operazione Completata', 'Documento aggiornato Correttamente!');
              this.changeDetectorRef.markForCheck()
            }
          )
        }

      }
    )

  }
  getTypeOperation(type){
    return this.typeOperation.find(x=> x.key === type);
  }

  getDataOperator(id,full?){
   // console.log(id)
    const data = this.operators.find(x=>x.id === id)
    if (full){ return data;}
    return `${data.surname} ${data.name}`
  }
  getPauseInfo(type){

    return this.problemsCheck.find(x=> x.value === type).viewValue;
  }

  onChangeStatus(status){

    switch (status) {
      case 'scheduled':
        this.mode = 'create';
            this.btnSubmit = 'Avvia Attività';
            this.formTask = this.initializeForEditTask(this.task);


        break;

      case 'inprogress':
        this.mode = 'edit';
            this.formTask = this.initializeForEditTask(this.task);
            this.btnSubmit = 'Concludi Attività';
            const taskCompleted = true;
           // const modeChecklist = this.task.checkList.filter(x=> !x.end).length > 0 ?  'create-operation';
            if(this.task.checkList.filter(x=> x.status ==='scheduled').length > 0){
              this.btnSubmit = 'Avvia Lavorazioni';
              this.mode ='create-operation';
            }
            if(this.task.checkList.filter(x=> x.status ==='inprogress').length > 0){
              this.btnSubmit = 'Concludi Operazioni';
              this.mode ='edit-operation';
            }
            console.log(this.tasks)
           const projectCompeted= this.tasks.filter(x=> x.status === 'completed').length === this.tasks.length;
           if(projectCompeted){
            console.log('completato il project')
           }else{
            console.log('ancora task residui')
           }
            //console.log(this.task)
            this.empService.fetchStampEvent({idTask: this.task.id, drop:true})
            .subscribe((res) => {
              const activeStamp = res.filter(x=> !x.end);
              this.stampingEvents = activeStamp;
            //  console.log(activeStamp)
              this.stampingListView = true;
              this.changeDetectorRef.markForCheck();
            })
        break;

      case 'paused':
        this.mode = 'edit'

            this.formTask = this.initializeForEditTask(this.task);
            this.btnSubmit = 'Riprendi Attività';
            this.empService.fetchStampEvent({idTask: this.task.id, drop:true})
            .subscribe((res) => {
              const activeStamp = res.filter(x=> !x.end);
              this.stampingEvents = activeStamp;
              this.stampingListView = true;
            })
        break;
      default:
        break;
    }
  }
  onClickSubmit(status){
    Object
      .keys(this.formTask.controls)
      .map((key: string) => this.formTask.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });
      switch (status) {
        case 'scheduled':
          const dialogType: MatDialogRef<TypeoperationDialogComponent> = this.dialog.open(
            TypeoperationDialogComponent,
            {
              panelClass: 'dialog-responsive',
              disableClose: true,
              minWidth:'65%',
              minHeight:'65%',
              data:{
                task: this.task,
                operators: this.operators
              }
            }
          )
          dialogType.afterClosed().subscribe(
            (task:Task) =>
            {
              if(!!task){
                if(this.formTask.valid){
                  let payload = this.formTask.getRawValue();
                  payload.dateStart = new Date().getTime().toString();
                  payload.status = 'inprogress';
                  payload.checkList = task.checkList;
                  payload.operators = task.operators;
                  const projectPayload = {
                    id: this.project.id,
                    status: payload.status,
                    dateStart: !this.project.dateStart ? payload.dateStart : this.project.dateStart,

                  }

                  task.operators.map(
                    (op) => {

                      const payloadStamping = {
                        idDip:op,
                        idTask: this.task.id,
                        idProject: this.project.id,
                        status:true,
                        start: payload.dateStart
                      }
                      this.empService.createStampEvent(payloadStamping).subscribe()
                    }
                  )
                  forkJoin([
                    this.projectService.updateProject(projectPayload),
                    this.projectService.updateTask(payload),

                  ]).subscribe(([project, task]) => {
                    this.project = project;
                    this.task = task;


                    this.onChangeStatus(this.task.status)
                    this.notification.toast(TYPE.SUCCESS,'Operazione Completata','Attivita iniziata con successo')
                  })


                }
              }
            }
          )
          break;

        case 'inprogress':
          this.projectService.fetchTask({drop: true, idProject: this.project.id})
          .subscribe((res)=> {this.tasks = res;});
          const ref : MatDialogRef<ChecklistDialogComponent> = this.dialog.open(ChecklistDialogComponent,
            {
              panelClass: 'dialog-responsive',
              disableClose: true,
              minWidth:'65%',
              minHeight:'65%',
              data:{
                task:this.task,
                typeOperationData:this.typeOperation,
                operatorsData: this.operators,
                mode: this.mode

              }
            })
            ref.afterClosed().subscribe(
              (res) =>{
                if(!!res){
                  // console.log(this.task,res)
                  this.task = res;
                  const operationCompleted = this.task.checkList.filter(x=> x.status === 'completed').length === this.task.checkList.length ? true:false;
                  if(operationCompleted){
                    this.completeTask()
                  }else{
                    this.projectService.updateTask(this.task).subscribe(
                      (res)=> {
                        this.task = res;
                        this.changeDetectorRef.markForCheck();
                        //console.log(this.tasks)
                        this.onChangeStatus(this.task.status);
                        this.notification.toast(TYPE.SUCCESS,'Operazione Effettuata','Attività aggiornata Correttamente!')
                      }
                    )
                  }
                }
              }
            )
          break;

        case 'paused':
          Swal.fire({
            title: 'Vuoi riprendere l\'attività interrotta?',
            icon:'warning',
            showCancelButton: true,
            cancelButtonText:'Annulla',
            confirmButtonText: 'Riprendi'
          }).then(
            (result)=> {
              if(result.isConfirmed){
                const payload = this.task;
                let typePause
                payload.interval.find((x)=> {

                  if(x.start && !x.end){
                    x.end = new Date().getTime();
                    x.totalMin = Math.floor((x.end - x.start)/1000/60);
                    typePause = x.problemcheck;
                  }
                });
                payload.status = 'inprogress';

                switch (typePause) {
                  case 'endShift':
                    const dialogType: MatDialogRef<TypeoperationDialogComponent> = this.dialog.open(
                      TypeoperationDialogComponent,
                      {
                        panelClass: 'dialog-responsive',
                        disableClose: true,
                        minWidth:'65%',
                        minHeight:'65%',
                        data:{
                          task: this.task,
                          operators: this.operators
                        }
                      }
                    )
                    dialogType.afterClosed().subscribe(
                      (task:Task) =>
                      {
                        if(!!task){
                          payload.checkList = task.checkList;
                          payload.operators = task.operators;
                          task.operators.map(
                            (op) => {
                              const payloadStamping = {
                                idDip:op,
                                idTask: this.task.id,
                                idProject: this.project.id,
                                status:true,
                                start: new Date().getTime().toString()
                              }
                              this.empService.createStampEvent(payloadStamping).subscribe();
                            }
                          )
                          forkJoin([
                            this.projectService.updateTask(payload),
                          ]).subscribe(([ task]) => {
                            this.task = task;
                            this.onChangeStatus(this.task.status);
                            this.notification.toast(TYPE.SUCCESS,'Operazione Completata','Attivita iniziata con successo');
                          })
                        }
                      }
                    )
                    break;
                  default:
                    this.projectService.updateTask(payload).subscribe(
                      (res)=> {
                        this.task = res;
                        this.onChangeStatus(this.task.status);
                        this.notification.toast(TYPE.SUCCESS,'Operazione Completata','Attivita iniziata con successo');
                        this.changeDetectorRef.markForCheck();
                    });
                    break;
                }
              }
            }
          );
          break;
      }
  }
  onClickPause(){
    const ref: MatDialogRef<PauseDialogComponent> = this.dialog.open(
      PauseDialogComponent,{
          panelClass: 'dialog-responsive',
          disableClose: true,
          minWidth:'65%',
          minHeight:'65%',
          data:{
            task: this.task,
            operators: this.operators,
            stampingEvents: this.stampingEvents
          }
        }
    );
    ref.afterClosed().subscribe(
      (int) => {
        if(!!int){
          const payload = this.task;
          payload.interval = this.task.interval ? this.task.interval : [];
          payload.interval.push(int);
          payload.status = 'paused';
          this.projectService.updateTask(payload).subscribe(
            (res) => {
              this.task = res;
              this.changeDetectorRef.markForCheck();
              this.onChangeStatus(this.task.status)
              this.notification.toast(TYPE.SUCCESS,'Operazione Completata','Attivita interrotta con successo')
              switch (int.problemcheck) {
                case 'endShift':
                    this.stampingEvents.map(
                      (x) => {
                        let totPauseMin = 0;
                        if(x.start && !x.end){
                          this.task.interval.map(
                            (int) => {
                             // console.log(int)
                              if(int.start && int.end && int.problemcheck !== 'endShift'){
                                let start = Number(int.start);
                                let end = Number(int.end);
                                if(end > Number(x.start)){totPauseMin += int.totalMin;}
                              }
                            }
                          )
                          x.end = new Date().getTime().toString();
                          x.ordinary =Math.floor(((Number(x.end) - Number(x.start))/1000/60) - totPauseMin );
                        }
                      }
                    );
                    this.stampingEvents.map(
                      (x) => {
                        this.empService.updateStampingEvent(x).subscribe()
                      }
                    )
                  break;
                default:
                  break;
              }
            }
          )
        }
      }
    )
  }

  private initializeForEditTask(task):FormGroup{
    return new FormGroup({
      id:new FormControl(task.id),
      dateStart: new FormControl(task.dateStart),
      dateEnd: new FormControl(task.dateEnd),
      status:  new FormControl(task.status),
      workingDeskMinutes:new FormControl(task.workingDeskMinutes),
      workingOperatorsMinutes:new FormControl(task.workingOperatorsMinutes),
      note:new FormControl(task.note),
    })
  }

  getCheckListData(type){

    return this.task.checkList.find(x=> x['type'] === type)

  }

  getStampData(id){
    //console.log(this.stampingEvents)
    return this.stampingEvents.filter(x=> x.idDip === id)
  }
  onClickClose(){
    this.dialogRef.close({project: this.project, task: this.task})
  }

  completeTask(){
    const endTime = new Date().getTime().toString();
    //console.log(this.stampingEvents);
    let workingOperatorsMinutes = 0;
    let workingDeskMinutes = 0;
    let minPause = 0;
    this.stampingEvents.map(
      (s)=> {
        if(!s.end){
          s.end = endTime;
          s.ordinary = Math.floor((Number(s.end) - Number(s.start))/1000/60);
          workingOperatorsMinutes += s.ordinary;
           this.empService.updateStampingEvent(s).subscribe(
            (res) => s = res
          )
        }
      }
    );
    this.task.checkList.map(
      (d) => workingDeskMinutes += d.totalMin
    )
    if(this.task.interval && this.task.interval.length>0){
      this.task.interval.map(
        (p) => {
          minPause += p.totalMin;
        }
      )
    }
    this.task.status = 'completed';
    this.task.workingDeskMinutes = workingDeskMinutes;
    this.task.workingOperatorsMinutes =workingOperatorsMinutes;
    this.task.dateEnd = endTime;
    this.tasks.find((x)=> {
      if(x.id === this.task.id){
          x.status= 'completed'
      }
    })
console.log(this.tasks , this.task)


    this.projectService.updateTask(this.task).subscribe(
      (res) => {
        this.task;
        this.changeDetectorRef.markForCheck();
        const checkOtherTask = this.tasks.filter(x=> x.status === 'completed').length === this.tasks.length ? true:false;
        if(checkOtherTask){
          this.project.status = 'completed';
          this.project.dateEnd = endTime;
          this.projectService.updateProject(this.project).subscribe(
            (res) =>{ this.project = res;
              const data = {task: this.task, project: this.project}
              this.dialogRef.close(data)
            }
          )
        }else{
          const data = {task: this.task, project: this.project}
          this.dialogRef.close(data)
        }

      }
    )




  }

}
