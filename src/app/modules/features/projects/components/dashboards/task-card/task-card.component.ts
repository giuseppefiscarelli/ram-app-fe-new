import { Subscription, forkJoin } from 'rxjs';
import { ManagementService } from '@app/modules/features/management/management.service';
import { Desk } from '@app/modules/models/desk.model';
import { Project } from '@app/modules/models/project.model';
import { Task } from '@app/modules/models/task.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SlideInOutAnimation } from '../../animations/slide.animations';
import { ProjectsService } from '../../../projects.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  animations: [SlideInOutAnimation],
  providers:[ManagementService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  @Input() desks: Desk[];
  project: Project;
   desk: Desk;
  animationState = 'out';
  data$: Subscription;
  isLoading: boolean;
  constructor( private service: ProjectsService,
    private managementService: ManagementService,
    private changeDetectorRef: ChangeDetectorRef,) {
      this.desk = null;
      this.project = null;
      this.isLoading = true;
    }

  ngOnInit(): void {
    this.data$ = forkJoin([

      this.service.getProjectData(this.task.idProject)
    ]).subscribe(([project]) => {
     // this.desk = this.desks.find(x=> x.id === this.task.idDesk);
      this.project = project;
      this.isLoading = false;
      this.changeDetectorRef.markForCheck();
    })
  }
  ngOnDestroy(): void {
   this.data$.unsubscribe()

  }
  toggleShowDiv(): void {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }
  getDesk(id){
    return this.desks.find(x=> x.id === id);
  }


}
