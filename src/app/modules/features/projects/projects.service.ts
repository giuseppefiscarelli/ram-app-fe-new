import { Task } from '@app/modules/models/task.model';
import { TasksFactory } from './../../models/factories/tasks.factory';
import { FitokDatasFactory } from './../../models/factories/fitokDatas.factory';
import { FitokData } from './../../models/fitokData.model';
import { FitokDatasDescriptorInterface, TasksDescriptorInterface } from './../../../config/network/api.descriptors';
import { ProjectFactory } from './../../models/factories/projects.factory';
import { Injectable } from '@angular/core';
import { ProjectsDescriptorInterface } from '@app/config/network/api.descriptors';
import { Project } from '@app/modules/models/project.model';
import { ApiService } from '@app/modules/network/api.service';
import { map, Observable } from 'rxjs';


@Injectable()
export class ProjectsService {

  constructor(private API: ApiService) {


  }

  fetchProject(payload?: any): Observable<Project[]> {
    return this.API.Projects.fetch(payload)
        .pipe(
            map((records: ProjectsDescriptorInterface[]) => records.map((record: ProjectsDescriptorInterface) => ProjectFactory.create(record)))
        );
}
getProject(internalCode): Observable<Project> {

  const payload = {internalCode: internalCode}
    return this.API.Projects.fetch(payload)
    .pipe(
      map((record: ProjectsDescriptorInterface) =>
      ProjectFactory.create(record))
  );
}
getProjectData(id): Observable<Project>{


  return this.API.Projects.get({id})
  .pipe(
      map((record: ProjectsDescriptorInterface) =>
      ProjectFactory.create(record))
  );
}

createProject(payload: any): Observable<Project> {
    return this.API.Projects.create(payload)
        .pipe(
            map((record: ProjectsDescriptorInterface) => ProjectFactory.create(record))
        );
}

/* importProject(payload:any): Observable<any> {
    return this.API.ProjectsImport.create(payload).pipe()
} */
updateProject(payload: any): Observable<Project> {
    return this.API.Projects.update(payload)
        .pipe(
            map((record: ProjectsDescriptorInterface) => ProjectFactory.create(record))
        );
}

deleteProject(id): Observable<any> {
    return this.API.Projects.delete({ id });
}


fetchFitokData(payload?: any): Observable<FitokData []> {
  return this.API.FitokData.fetch(payload)
      .pipe(
          map((records: FitokDatasDescriptorInterface[]) => records.map((record: FitokDatasDescriptorInterface) => FitokDatasFactory.create(record)))
      );
}
getFitokData(id): Observable<FitokData> {


  return this.API.FitokData.get({id})
  .pipe(
      map((record: FitokDatasDescriptorInterface) =>
      FitokDatasFactory.create(record))
  );
}
fetchTask(payload?:any): Observable<Task[]>{
  return this.API.Task.fetch(payload)
  .pipe(
      map((records: TasksDescriptorInterface[]) =>
      records.map((record: TasksDescriptorInterface) =>
      TasksFactory.create(record)))
  );
}
createTask(payload: any): Observable<Task> {
  return this.API.Task.create(payload)
      .pipe(
          map((record: TasksDescriptorInterface) => TasksFactory.create(record))
      );
}

updateTask(payload): Observable<Task> {
  return this.API.Task.update(payload)
      .pipe(
          map((record: TasksDescriptorInterface) => TasksFactory.create(record))
      );
}
deleteTask(id): Observable<any> {
  return this.API.Task.delete({ id });
}

typeProject: any[] =[
  {value:1, label:'Bassa'},
  {value:2, label:'Standard'},
  {value:3, label:'Urgente'},

]
}
