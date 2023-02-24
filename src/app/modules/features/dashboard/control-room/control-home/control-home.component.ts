import { IndexComponent } from './../../../../../components/index/index.component';
import { Employee } from '@app/modules/models/employee.model';
import { EmployeesService } from '@app/modules/features/employees/employees.service';
import { Task } from '@app/modules/models/task.model';
import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { User } from '@app/modules/models/user.model';
import { Desk } from '@app/modules/models/desk.model';
import { FitokData } from '@app/modules/models/fitokData.model';
import { Project } from '@app/modules/models/project.model';
import { ApplicationState } from '@app/app.state';
import { ManagementService } from '@app/modules/features/management/management.service';
import { ProjectsService } from '@app/modules/features/projects/projects.service';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavbarComponent } from '@app/components/navbar/navbar.component';

@Component({
  selector: 'app-control-home',
  templateUrl: './control-home.component.html',
  styleUrls: ['./control-home.component.scss'],
  providers:[ProjectsService, ManagementService, EmployeesService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class ControlHomeComponent implements OnInit {
  user: Observable<User>;
  userMe: User;

  tasks: Task [];
  projects: Project[];
  fitokData: FitokData[];
  employees: Employee[];
  today: Date;
  deskData: Desk;
  desks : Desk[];

  isLoading:boolean;

  displayedColumnsTasks: string[] = ['desk','operators','internalCode','status','projectType'];
  constructor(
                private projectService: ProjectsService,
                private store: Store<ApplicationState>,
                private translator: TranslateService,
                private managementService: ManagementService,
                private empService: EmployeesService,

  ) {
    this.user = this.store.pipe(select('authentication'),select('user'));
    this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
    this.isLoading = true;
    this.tasks = [];
    this.projects = [];
    this.fitokData = [];
    this.today = new Date();
    this.deskData = null;
    this.employees = [];
    this.desks = [];
    this.managementService.fetchDesk().subscribe((res)=> this.desks = res)

    this.empService.fetch().subscribe((res)=> this.employees = res)
    this.getTasksData();
   }

  ngOnInit(): void {

  }
  getTasksData(){
    this.projectService.fetchTask().subscribe(
      {
       next: (res: Task[]) => this.tasks = res,
       complete: ()=> {
        this.getProjectData(this.tasks)


      }

      }
    )
  }
  getProjectInfo(id){
    return this.projects.find(x=>x.id === id)
    }

  getEmpData(id): string{

    const data = this.employees.find(x=> x.id === id);

    return `${data.surname} ${data.name}`
  }
  getDeskData(id):string{
    return this.desks.find(x=> x.id === id).name
  }
  getProjectData(tasks) {

    //console.log(tasks)
   tasks.map(
      (task: Task) => {
        console.log(task)


        this.projectService.getProjectData(task.idProject).subscribe(
          {
            next: (res) => {
              if(res){
                this.projects.push(res);
                this.projectService.fetchFitokData({term:res.internalCode}).subscribe(
                  (res)=>
                  {
                    if(res){
                      this.fitokData.push(res[0])
                    }
                  }
                )

              }

            },
          }
        )
      }
    );


    setTimeout(() => {
      this.isLoading= false
    }, 2400)



  }

}
