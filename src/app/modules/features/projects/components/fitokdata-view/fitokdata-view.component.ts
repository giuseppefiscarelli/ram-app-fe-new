import { TYPE } from './../../../../notifications/values.constants';
import { NotificationsComponent } from './../../../../notifications/notifications.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectsService } from './../../projects.service';
import { Project } from './../../../../models/project.model';
import { ManagementService } from './../../../management/management.service';
import { EmployeesService } from './../../../employees/employees.service';
import { MonitoringService } from './../../../monitoring/monitoring.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { FitokData } from './../../../../models/fitokData.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { User } from '@app/modules/models/user.model';
import { forkJoin, Observable, Subject, Subscription, take } from 'rxjs';
import { ApplicationState } from '@app/app.state';
import { Store, select } from '@ngrx/store';
import { Operator } from '@app/modules/models/operator';
import { Desk } from '@app/modules/models/desk.model';
import { Employee } from '@app/modules/models/employee.model';
import { Task } from '@app/modules/models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as Moment from 'moment-timezone';
import { PdfViewProjectComponent } from '../common/pdf-view-project/pdf-view-project.component';
moment.locale('it')

@Component({
  selector: 'app-fitokdata-view',
  templateUrl: './fitokdata-view.component.html',
  styleUrls: ['./fitokdata-view.component.scss'],
  providers:[ManagementService,EmployeesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FitokdataViewComponent implements OnInit ,OnChanges, OnDestroy{






  type: any[];

  //optimize
  @Input() fitok: FitokData;
  @Input() project: Project;
  tasks: Task[];
  dropOperator: Employee[];
  dropDesk: Desk[];

  data$: Subscription;

  isLoading: boolean;
  form: FormGroup;
  formTask: FormGroup;
  btnTaskAction: string;

  user: Observable<User>;
  userMe: User;

  displayedColumnsTask: string[] = ['desk','phase','status', 'operators', 'type', 'workingTime','action'];


  testoption = [
    {key:'fianchi', value:'Fianchi'},
    {key:'teste', value:'Teste'},
    {key:'coperchi', value:'Coperchi'},
    {key:'base', value:'Base'},
    {key:'fissaggi', value:'Fissaggi'},
    {key:'selle', value:'Selle'},
    {key:'cravatte', value:'Cravatte'},
    {key:'telaio-fianchi', value:'Telaio - Fianchi'},
    {key:'telaio-teste', value:'Telaio - Teste'},
    {key:'telaio-cop', value:'Telaio - Cop'},
    {key:'riv-fianchi', value:'Riv - Fianchi'},
    {key:'riv-teste', value:'Riv - Teste'},
    {key:'riv-cop', value:'Riv - Cop'},
  ];

  constructor(  private dateAdapter: DateAdapter<any>,
                private store: Store<ApplicationState>,
                private changeDetectorRef: ChangeDetectorRef,
                private mngService: ManagementService,
                private empService: EmployeesService,
                private service: ProjectsService,
                private snackbar: MatSnackBar,
                private dialog: MatDialog,
                private notification: NotificationsComponent) {
                this.user = this.store.pipe(select('authentication'),select('user'));
                this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
                this.dateAdapter.setLocale('it-IT');
                this.isLoading = true;
                this.tasks = [];
                this.type = this.service.typeProject;




  }

  ngOnInit(): void {

  }
  viewFile(url): void{

    // window.open(url, "_blank");
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
          this.service.updateProject(this.project).subscribe(
            (res)=> {
              this.notification.toast(TYPE.SUCCESS,'Operazione Completata', 'Documento aggiornato Correttamente!');
            }
          )
        }

      }
    )

}
  ngOnDestroy(): void {
    this.data$.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {

    if(changes['fitok'] && changes['fitok'].currentValue){
       this.fitok = changes['fitok'].currentValue;
    }
    if(changes['project'] && changes['project'].currentValue){
      this.project = changes['project'].currentValue;
      this.data$ = forkJoin([
          this.empService.fetch(),
          this.mngService.fetchDesk(),
          this.service.fetchTask({idProject:this.project.id, drop:true})
      ]).subscribe(
        ([operator,desk, task]) => {
          this.dropDesk = desk;
          this.dropOperator = operator;
          this.tasks = task;
          this.changeDetectorRef.markForCheck();
        }
      );
   }

  }
  onClickPlan(){
      this.form = this.initializeForPlan();
  }

  initializeForPlan(): FormGroup{
    return new FormGroup({
      id: new FormControl(this.project.id),
      datePlanStart: new FormControl(null,[Validators.required]),
      datePlanEnd:  new FormControl(null,[Validators.required]),
      dateDelivery:  new FormControl(null,[Validators.required]),
      status: new FormControl('scheduled'),
      idSupervisor: new FormControl(this.userMe.id),
      type: new FormControl(null,[Validators.required])

    })
  }
  onClickPlanSubmit(){
    Object
      .keys(this.form.controls)
      .map((key: string) => this.form.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });

      if(this.form.valid){
        const payload = this.form.value;
        payload.datePlanStart = new Date(payload.datePlanStart).getTime().toString()
        const end = moment(payload.datePlanEnd).endOf('day').toISOString()
        payload.datePlanEnd = new Date(end).getTime().toString()
        payload.dateDelivery = new Date(payload.dateDelivery).getTime().toString()
        this.service.updateProject(payload).subscribe({
          next: (res:Project) => this.project = res,
          error:(err)=>{
            this.notification.toast(TYPE.ERROR,'Errore', 'Pianificazione non inserita!');
          },
          complete: () => {
            this.notification.toast(TYPE.SUCCESS,'Operazione Completata', 'Pianificazione Inserita Correttamente!');
            this.changeDetectorRef.markForCheck();
          }
        });
      }
  }
  onClickInsertTask(){
    this.formTask = this.initializeForTask()
  }
  initializeForTask(): FormGroup{

    return new FormGroup({
      idDesk: new FormControl(null),
      operators: new FormControl(null),
      typeOperations: new FormControl(null),
      quantity: new FormControl(this.fitok.quantity),
      idProject: new FormControl(this.project.id),
      datePlanStart: new FormControl(this.project.datePlanStart),
      datePlanEnd:  new FormControl(this.project.datePlanEnd),
      status: new FormControl('scheduled'),
    });
  }

  onClickTaskSubmit(){
    Object
    .keys(this.formTask.controls)
    .map((key: string) => this.formTask.get(key))
    .forEach((control: AbstractControl) => {
        control.markAsDirty();
        control.markAsTouched();
    });

        if (this.formTask.valid) {
          const payload = this.formTask.value;
          payload.checkList = [];
          payload.typeOperations.map(
            (op) =>{
                payload.checkList.push(
                  {
                      type: op,
                      status: payload.status,
                      start: null,
                      end: null,
                  }
                )
            }
          )
          this.service.createTask(payload)
          .subscribe(
            (res:Task)  => {
              if(!!res){
                const updatedRecords = [...this.tasks].concat([res]);
                this.tasks = [...updatedRecords];
                this.changeDetectorRef.markForCheck();
                this.formTask = this.initializeForTask();
                this.notification.toast(TYPE.SUCCESS,'Operazione Completata', 'Attività Inserita Correttamente!');
              }
            }
          )
        }
  }
  onClickTaskEdit(mode: string,task: Task,atIndex: number){
    switch (mode) {
      case 'edit':
          const ref: MatDialogRef<TaskEditComponent> = this.dialog.open(
            TaskEditComponent,
            {
              panelClass:'dialog-responsive',
              disableClose:true,
              minWidth:'80%',
              minHeight:'95%',
              maxWidth: '95vw',
              height:'95%',
              data:{
                task,
                project: this.project,
                fitok: this.fitok,
                operators: this.dropOperator,
                deskData: this.dropDesk.find(x=> x.id === task.idDesk),
                mode,typeOperations: this.testoption

              }
            }
          );
          ref.afterClosed().subscribe(
            (res) => {
              if(!!res){
                this.notification.toast(TYPE.SUCCESS,'Operazione Completata','Attività aggiornata!')
                const currentTasks = [...this.tasks];
                currentTasks[atIndex] = res;
                this.tasks = [...currentTasks];
                this.changeDetectorRef.markForCheck();
                let taskCompleted = 0;
                let taskInProgress = 0;
                let startDate;
                let endDate;
                this.tasks.map(
                  (task, i, arr) => {
                    if(task.status === 'completed'){
                      taskCompleted++;
                    }
                    if(task.status === 'inprogress'){
                      taskInProgress++;
                    }

                  }
                );
                startDate = this.tasks.filter(x => Number(x.dateStart) > 0).reduce((a,b) =>  Number(a.dateStart) < Number(b.dateStart) && Number(b.dateStart) > 0 ?  a:b)
                endDate = this.tasks.reduce((a,b) => Number(a.dateEnd) > Number(b.dateEnd) ? a:b)
                console.log( startDate, endDate.dateEnd)
                if(taskCompleted === this.tasks.length){
                  this.project.status = 'completed';
                  this.project.dateEnd = endDate.dateEnd;
                }
                else if(taskInProgress > 0 || taskCompleted > 0){
                  this.project.status = 'inprogress';
                  this.project.dateStart = endDate.dateStart;
                }

                this.service.updateProject(this.project).subscribe(
                  (res) => {
                    if(!!res){
                      this.project = res;
                      this.changeDetectorRef.markForCheck();
                    }
                  }
                )
              }
            }
          )

      break;

      case 'delete':
        Swal.fire({
          title: 'Vuoi eliminare l\'attività programmata?',
          text: 'L\'operazione è irreversibile',
          icon:'warning',
          showCancelButton: true,
          cancelButtonText:'Annulla',
          confirmButtonText: 'Elimina'
        }).then(
          (result)=> {
            if(result.isConfirmed){
              this.service.deleteTask(task.id).subscribe();
              this.tasks = this.tasks.filter(x=> x.id !== task.id);
              this.changeDetectorRef.markForCheck();
              this.notification.toast(TYPE.SUCCESS,'Operazione Completata', 'Attività eliminata correttamente');
            }
          }
        );
        break;

      case 'view':
        const refB: MatDialogRef<TaskEditComponent> = this.dialog.open(
          TaskEditComponent,
          {
            panelClass:'dialog-responsive',
            disableClose:true,
            minWidth:'80%',
            minHeight:'95%',
            maxWidth: '95vw',
            data:{
              task,
              project: this.project,
              fitok: this.fitok,
              operators: this.dropOperator,
              deskData: this.dropDesk.find(x=> x.id === task.idDesk),
              mode,typeOperations: this.testoption

            }
          }
        );
        break;
      default:
        break;
    }
  }
  onToppingRemovedOption(topping: string,controlForm:string) {
    const toppings = this.formTask.controls[controlForm].value as string[];
    this.removeFirst(toppings, topping);
    this.formTask.controls[controlForm].setValue(toppings); // To trigger change detection
  }
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  filterOption(key): string{
    const data = this.testoption.find(x=> x.key === key)
    return data.value
  }
  filterOperator(id):string{
    const data = this.dropOperator.find(x=>x.id ===id)
    return `${data.surname} ${data.name}`
  }
  filterDesk(id): Desk{
    return this.dropDesk.find(x=>x.id === id)
  }


}
