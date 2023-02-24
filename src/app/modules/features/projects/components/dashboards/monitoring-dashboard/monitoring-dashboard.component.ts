import { SlideInOutAnimation } from '../../animations/slide.animations';
import { ManagementService } from '@app/modules/features/management/management.service';
import { Subscription } from 'rxjs';
import { Desk } from '@app/modules/models/desk.model';
import { Project } from '@app/modules/models/project.model';
import { ProjectsService } from '@app/modules/features/projects/projects.service';
import { Task } from '@app/modules/models/task.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitoring-dashboard',
  templateUrl: './monitoring-dashboard.component.html',
  styleUrls: ['./monitoring-dashboard.component.scss'],
  providers:[ManagementService],
  animations: [SlideInOutAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringDashboardComponent implements OnInit {
  tasks: Task[];
  today: string;
  projectData: Project[];
  desks: Desk[];
  data$: Subscription;

  tasksScheduled: Task[];
  tasksPaused: Task[];
  tasksInprogress: Task[];
  tasksCompleted: Task[];


  animationState = 'out';


  constructor(
      private service: ProjectsService,
      private changeDetectorRef: ChangeDetectorRef,
      private managementService: ManagementService
      ) {
    this.today = new Date().getTime().toString();
    this.tasks = [];
    this.desks = [];
    this.tasksScheduled = [];
    this.tasksPaused = [];
    this.tasksInprogress  = [];
    this.tasksCompleted = [];
    this.initializeDash();
    this.data$ = this.managementService.fetchDesk({drop:true}).subscribe((res) => this.desks = res)

   }

  ngOnInit(): void {
  }
  initializeDash(){
    this.projectData = [];
    this.service.fetchTask({drop:true, today: this.today}).subscribe(
      (res: Task[]) => {
        this.tasks = res;
        this.getProjectData(res);
        this.tasksScheduled = this.tasks.filter(x=> x.status === 'scheduled');
        this.tasksPaused = this.tasks.filter(x=> x.status === 'paused');
        this.tasksInprogress = this.tasks.filter(x=> x.status === 'inprogress');
        this.tasksCompleted = this.tasks.filter(x=> x.status === 'completed');

      }
    )
  }
  getProjectData(tasks: Task[]){

    if(tasks.length > 0){
      tasks.map((task) =>
        {
          this.service.getProjectData(task.idProject).subscribe((res)=> this.projectData.push(res))

        }
      )
    }
    this.changeDetectorRef.markForCheck()
  }

  getProject(id){
    return this.projectData.find(x=> x.id === id);
  }

  getDesk(id){
    return this.desks.find(x=> x.id === id);
  }
  toggleShowDiv(): void {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

}
