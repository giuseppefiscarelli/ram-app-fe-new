import { ProjectFactory } from './../models/factories/projects.factory';
import { ProjectsDescriptorInterface } from '@app/config/network/api.descriptors';
import { Project } from '@app/modules/models/project.model';
import { Injectable } from '@angular/core';
import { ApiService } from '../network/api.service';
import { map, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private API: ApiService) {


   }
   getProjectData(id): Observable<Project> {
    return this.API.Projects.get({id})
    .pipe(
        map((record: ProjectsDescriptorInterface) =>
        ProjectFactory.create(record))
    );
  }
  getFile(file: any): Observable<any> {
    return this.API.Download.get(file, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Content-Type', 'application/json')
    });

  }



}
