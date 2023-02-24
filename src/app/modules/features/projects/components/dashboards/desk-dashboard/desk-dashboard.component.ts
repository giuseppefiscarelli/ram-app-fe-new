import { Task } from '@app/modules/models/task.model';
import { Employee } from '@app/modules/models/employee.model';
import { Subscription, forkJoin } from 'rxjs';
import { EmployeesService } from '@app/modules/features/employees/employees.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ManagementService } from '@app/modules/features/management/management.service';
import { Desk } from '@app/modules/models/desk.model';
import { Project } from '@app/modules/models/project.model';
import { ProjectsService } from '../../../projects.service';

@Component({
  selector: 'app-desk-dashboard',
  templateUrl: './desk-dashboard.component.html',
  styleUrls: ['./desk-dashboard.component.scss'],
  providers:[ManagementService, EmployeesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeskDashboardComponent implements OnInit {
  today: string;
  projects: Project[];
  desks: Desk[];
  data$: Subscription;
  employees: Employee[];
  isLoading:boolean;
  tasks: Task[];
  constructor( private service: ProjectsService,
                private managementService: ManagementService,
                private employeeService: EmployeesService,
                private changeDetectorRef: ChangeDetectorRef,) {
                  this.today = new Date().getTime().toString();
                  this.desks = this.projects = this.employees = this.tasks = [];
                  this.isLoading = false;


                  this.data$ = forkJoin([
                    this.employeeService.fetch({drop:true}),
                    this.service.fetchProject({drop:true, today: this.today}),
                    this.managementService.fetchDesk(),
                    this.service.fetchTask({drop:true, today: this.today})
                  ]).subscribe(
                    ([emp, projects, desks, tasks]) =>{
                      this.employees = emp;
                      this.projects = projects;
                      this.desks = desks;
                      this.tasks = tasks;
                      this.isLoading = false;
                      this.changeDetectorRef.markForCheck()
                    }
                  )
                }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
   this.data$.unsubscribe();

  }
  filterTask(idDesk): Task[]{
    return this.tasks.filter(x=> x.idDesk === idDesk)
  }

}
