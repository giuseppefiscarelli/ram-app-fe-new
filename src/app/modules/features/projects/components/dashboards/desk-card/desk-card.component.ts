import { Employee } from '@app/modules/models/employee.model';
import { Project } from '@app/modules/models/project.model';
import { Task } from '@app/modules/models/task.model';
import { ProjectsService } from '@app/modules/features/projects/projects.service';
import { Desk } from '@app/modules/models/desk.model';
import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { SlideInOutAnimation } from '../../animations/slide.animations';

@Component({
  selector: 'app-desk-card',
  templateUrl: './desk-card.component.html',
  styleUrls: ['./desk-card.component.scss'],
  animations: [SlideInOutAnimation],
})
export class DeskCardComponent implements OnInit, OnChanges {
  @Input() desk: Desk;
  @Input() tasks: Task[];
  animationState = 'out';
  data$: Subscription;
  isLoading: boolean;
  today: Date;
  @Input() projects: Project[];
  @Input() employees: Employee[];

  projectScheduled: Project[];
  projectInprogress: Project [];
  projectPaused: Project [];
  projectCompleted: Project [];
  constructor(private service: ProjectsService) {
    this.isLoading = true;

    this.projects = this.projectScheduled = this.projectInprogress = this.projectPaused = this.projectCompleted = [];
    this.today = new Date();

   }

  ngOnInit(): void {


  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if(changes['tasks'] && changes['tasks'].currentValue){
      this.tasks = this.tasks.filter(x=> x.idDesk === this.desk.id)
      this.projects =this.projects.filter((el) => {
        return this.tasks.some((f) => {
          return f.idProject === el.id ;
        });
      });
      this.projectScheduled = this.projects.filter(x=> x.status === 'scheduled');
      this.projectInprogress = this.projects.filter(x=> x.status === 'inprogress');
      this.projectPaused = this.projects.filter(x=> x.status === 'paused');
      this.projectCompleted = this.projects.filter(x=> x.status === 'completed');
      this.isLoading = false;

    }
  }

  toggleShowDiv(): void {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  getTaskData(idProject){
    return this.tasks.find(x=> x.idProject === idProject);
  }
  getOperationTask(): string{
    const task = this.tasks.find(x=> x.status === 'inprogress')
    if(task){
      return task.status
    }
    return 'enable';
  }
  getEmployeeData(id): string{
    console.log(this.employees, id)
    const data = this.employees.find(x=> x.id === id)
    return `${data.surname} ${data.name}`
  }

}
