import { Desk } from '@app/modules/models/desk.model';
import { Task } from '@app/modules/models/task.model';
import { ProjectsService } from '@app/modules/features/projects/projects.service';
import { Project } from '@app/modules/models/project.model';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input() project: Project;
  @Input() desks: Desk[];
  tasks: Task[]
  constructor(private service: ProjectsService)
    {
     /*  this.service.fetchTask({drop: true, idProject: this.project.id}).subscribe(
        (res) => this.tasks = res
      ) */

    }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
       console.log(changes)
       if(changes['project'] && changes['project'].currentValue){
        this.service.fetchTask({drop: true, idProject: this.project.id}).subscribe((res) => this.tasks = res)
       }
  }
  getDeskData(id){

    return this.desks.find(x=> x.id === id)
  }

}
