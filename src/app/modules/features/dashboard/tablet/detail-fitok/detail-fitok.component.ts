import { SharedService } from './../../../../shared/shared.service';
import { ProjectsService } from './../../../projects/projects.service';
import { FitokData } from './../../../../models/fitokData.model';
import { Subscription, forkJoin } from 'rxjs';
import { Project } from '@app/modules/models/project.model';
import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Task } from '@app/modules/models/task.model';
import { Employee } from '@app/modules/models/employee.model';
import { EmployeesService } from '@app/modules/features/employees/employees.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FitokDialogComponent } from '../fitok-dialog/fitok-dialog.component';
import { PdfViewProjectComponent } from '@app/modules/features/projects/components/common/pdf-view-project/pdf-view-project.component';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { TYPE } from '@app/modules/notifications/values.constants';

@Component({
  selector: 'app-detail-fitok',
  templateUrl: './detail-fitok.component.html',
  styleUrls: ['./detail-fitok.component.scss'],
  providers:[EmployeesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailFitokComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  @Input() task: Task;
  @Input() fitok: FitokData;
  dropOperator: Employee[];
  data$: Subscription;
  isLoading=true;


  testoption = [
    {key:'fianchi', value:'Fianchi'},
    {key:'teste', value:'Teste'},
    {key:'coperchi', value:'Coperchi'},
    {key:'base', value:'Base'},
    {key:'fissaggi', value:'Fissaggi'},
    {key:'selle', value:'Selle'},
    {key:'cravatte', value:'Cravatte'},
    {key:'telaio-fianchi', value:'Telaio-fianchi'},
    {key:'telaio-teste', value:'Telaio Teste'},
    {key:'telaio-cop', value:'Telaio Cop'},
    {key:'riv-fianchi', value:'Riv Fianchi'},
    {key:'riv-teste', value:'Riv Teste'},
    {key:'riv-cop', value:'Riv Cop'},
  ];

  constructor(
              private empService: EmployeesService,
              private sharedService: SharedService,
              private dialog: MatDialog,
              private service: ProjectsService,
              private changeDetectorRef: ChangeDetectorRef,
              private notification: NotificationsComponent
              ) {
    this.dropOperator = [];
  }

  ngOnInit(): void {
    this.data$ = forkJoin([
      this.empService.fetch({drop:true})
    ]).subscribe(
      ([emp]) => {
        this.dropOperator = emp;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck()
      }
    )
  }
  ngOnDestroy(): void {
    this.data$.unsubscribe();
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
          this.service.updateProject(this.project).subscribe(
            (res)=> {
              this.notification.toast(TYPE.SUCCESS,'Operazione Completata', 'Documento aggiornato Correttamente!');
              this.changeDetectorRef.markForCheck()
            }
          )
        }

      }
    )

  }
  getTestOption(key):string{
    const data = this.testoption.find(x=>x.key === key);
    return data.value;
  }

  getEmpData(id){
    return this.dropOperator.find(x=>x.id===id);
  }

  onClickFitok(task){
    const ref: MatDialogRef<FitokDialogComponent> = this.dialog.open(
      FitokDialogComponent,
        {
            disableClose: true,
            width:'95%',
            height:'95%',

            maxWidth: '95vw',
            data: {
                task,
                project:this.project,
                typeOperation: this.testoption,
                fitok:this.fitok,
                operators: this.dropOperator
            },
        }
    );
    ref.afterClosed().subscribe(
      (data)=>{
        if(!!data && data.task && data.project){
          this.task = data.task;
          this.project = data.project;
          this.changeDetectorRef.markForCheck()
        }
      }
    )
  }
}
