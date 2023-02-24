import { Desk } from '@app/modules/models/desk.model';
import { ManagementService } from '@app/modules/features/management/management.service';
import { Component, OnInit } from '@angular/core';
import { Project } from '@app/modules/models/project.model';
import { Subscription, forkJoin } from 'rxjs';
import { ProjectsService } from '../../../projects.service';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss'],
  providers:[ManagementService]
})
export class ProjectDashboardComponent implements OnInit {
    today: string;
    data$: Subscription;
    projectData: Project[];
    isLoading: boolean;
    desks: Desk[]


    constructor(private service: ProjectsService, private managementService: ManagementService) {
      this.projectData = this.desks= [];
      this.today = new Date().getTime().toString();
      this.isLoading = true;
      this.data$ = forkJoin([
        this.service.fetchProject({drop: true, today:this.today}),
        this.managementService.fetchDesk({drop:true})

      ]).subscribe(
        ([projects, desks]) => {
          this.projectData = projects;
          this.desks = desks;
          this.isLoading = false;
        }
      )



     }

    ngOnInit(): void {
    }
    filterProjectByStatus(status){

      return this.projectData.filter(x=> x.status === status)
    }

}
