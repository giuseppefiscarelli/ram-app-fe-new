import { DesksFactory } from './../../models/factories/desks.factory';
import { DesksDescriptorInterface } from './../../../config/network/api.descriptors';
import { Desk } from './../../models/desk.model';
import { Injectable } from '@angular/core';
import { ApiService } from '@app/modules/network/api.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

constructor(private API: ApiService) { }

//Desk
    fetchDesk(payload?: any): Observable<Desk[]>{
      return this.API.Desks.fetch(payload)
      .pipe(
          map((areas: DesksDescriptorInterface[]) =>
              areas.map((area: DesksDescriptorInterface) =>
                  DesksFactory.create(area))
          )
      );
    }
    getDesk(id: number): Observable<Desk>{
      return this.API.Desks.get({id})
      .pipe(
          map((area: DesksDescriptorInterface) =>
          DesksFactory.create(area))
      );
    }
    createDesk(payload: any): Observable<Desk>{
      return this.API.Desks.create(payload)
      .pipe(
          map((area: DesksDescriptorInterface) =>
          DesksFactory.create(area))
      );
    }
    updateDesk(payload: any): Observable<Desk>{
      return this.API.Desks.update(payload)
      .pipe(
          map((area: DesksDescriptorInterface) =>
          DesksFactory.create(area))
      );
    }
    deleteDesk(id: string): Observable<any> {
      return this.API.Desks.delete({ id });
    }


}
