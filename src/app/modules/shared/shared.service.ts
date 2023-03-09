
import { ProjectsDescriptorInterface } from '@app/config/network/api.descriptors';

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

  getFile(file: any): Observable<any> {
    return this.API.Download.get(file, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Content-Type', 'application/json')
    });

  }



}
