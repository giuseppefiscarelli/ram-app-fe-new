import { StampingEvent } from './../../models/stampingEvent.model';
import { StampingEventsFactory } from './../../models/factories/stampingEvents.factory';
import { EmployeesFactory } from './../../models/factories/employees.factory';
import { Employee } from './../../models/employee.model';
import { Injectable } from '@angular/core';
import { EmployeeDescriptorInterface, StampingEventsDescriptorInterface } from '@app/config/network/api.descriptors';
import { ApiService } from '@app/modules/network/api.service';
import { Observable, map } from 'rxjs';

@Injectable()
export class EmployeesService {

constructor(private API: ApiService) { }
    fetch(payload?: any): Observable<Employee[]> {
      return this.API.Employee.fetch(payload)
          .pipe(
              map((users: EmployeeDescriptorInterface []) => users.map((user: EmployeeDescriptorInterface) => EmployeesFactory.create(user)))
          );
    }
    getEmployee(id: number): Observable<Employee> {
      return this.API.Employee.get({id})
      .pipe(
          map((user: EmployeeDescriptorInterface) =>
          EmployeesFactory.create(user))
      );
    }

    createEmployee(payload: any): Observable<Employee>{
      return this.API.Employee.create(payload)
      .pipe(
          map((area: EmployeeDescriptorInterface) =>
          EmployeesFactory.create(area))
      );
    }
    createStampEvent(payload: any): Observable<StampingEvent> {
      return this.API.StampingEvent.create(payload)
          .pipe(
              map((stamp: StampingEventsDescriptorInterface) =>
              StampingEventsFactory.create(stamp))
          );
    }
    updateStampingEvent(payload: StampingEventsDescriptorInterface): Observable<StampingEvent>{
      return this.API.StampingEvent.update(payload)
          .pipe(
              map((stamp: StampingEventsDescriptorInterface) => StampingEventsFactory.create(stamp))
          )
    }
    fetchStampEvent(payload?: any): Observable<StampingEvent[]> {
      return this.API.StampingEvent.fetch(payload)
          .pipe(
              map((stamps: StampingEventsDescriptorInterface[]) =>
                  stamps.map((stamp: StampingEventsDescriptorInterface) =>
                      StampingEventsFactory.create(stamp)))
          );
  }

}
