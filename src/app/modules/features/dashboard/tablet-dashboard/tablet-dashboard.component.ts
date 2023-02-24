import { FitokData } from './../../../models/fitokData.model';
import { ManagementService } from './../../management/management.service';
import { Desk } from '@app/modules/models/desk.model';
import { Project } from '@app/modules/models/project.model';
import { Task } from './../../../models/task.model';

import { Component, OnInit } from '@angular/core';
import { ApplicationState } from '@app/app.state';

import { User } from '@app/modules/models/user.model';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { ProjectsService } from '../../projects/projects.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-tablet-dashboard',
  templateUrl: './tablet-dashboard.component.html',
  styleUrls: ['./tablet-dashboard.component.scss'],
  providers:[ProjectsService, ManagementService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TabletDashboardComponent implements OnInit {
  user: Observable<User>;
  userMe: User;

  tasks: Task[];
  projects: Project[];
  fitokData: FitokData[];
  today: Date;
  deskData: Desk;

  displayedColumnsTasks: string[] = ['internalCode','status','projectType'];
  displayedColumnsTasksWithExpand = [...this.displayedColumnsTasks, 'expand'];

  isLoading:boolean;
  constructor(  private projectService: ProjectsService,
                private store: Store<ApplicationState>,
                private translator: TranslateService,
                private managementService: ManagementService
                 ) {
                  this.isLoading = true;
                  this.tasks = [];
                  this.projects = [];
                  this.fitokData = [];
                  this.today = new Date();
                  this.deskData = null;

        this.user = this.store.pipe(select('authentication'),select('user'));
        this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
        this.managementService.getDesk(this.userMe.id).subscribe(
          {
            next:(res: Desk) => this.deskData = res,
            complete: ()=>{
             this.getTasksData(this.deskData);
            }
          }
        )



   }

  ngOnInit(): void {

  }

  getProjectData(tasks) {
   tasks.map(
      (task: Task) => {
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

  getFitokDataInfo(fitok){

   return this.fitokData.find(x=> x.fitok === fitok)

  }

  getProjectInfo(id){
  return this.projects.find(x=>x.id === id)
  }

  getTasksData(deskData){
    this.projectService.fetchTask({idDesk: deskData.id, drop:true}).subscribe(
      {
       next: (res: Task[]) => this.tasks = res.filter(x=> x.status !== 'completed'),
       complete: ()=> {
        this.getProjectData(this.tasks)


      }

      }
    )
  }

 }
