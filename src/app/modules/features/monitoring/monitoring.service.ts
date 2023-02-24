import { Fitok } from './../../models/fitok';
import { Desk } from '../../models/desk';
import { Operator } from '../../models/operator';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private http: HttpClient;

constructor(handler: HttpBackend,) {
  this.http = new HttpClient(handler);
 }

private apiServerUrl = 'https://ensmp3tuff.execute-api.eu-west-1.amazonaws.com/dev';
getOperators(): Observable<Operator[]> {
  return this.http.get<Operator[]>(`${this.apiServerUrl}/productionmonitoring/operators`).pipe(
    map((response) => response)
  );
}

getDesks():Observable<Desk[]> {
  return this.http.get<Desk[]>(`${this.apiServerUrl}/productionmonitoring/working-desk`).pipe(
    map((response) => response)
  );
}

getByFitok(name:string): Observable<Fitok[]> {

  return this.http.get<Fitok[]>(`${this.apiServerUrl}/productionmonitoring/desk?fitok=${name}`).pipe(
    map((response) => response)
  );
}

updateFitok(name: string, fitok:Fitok) :Observable<void>{

  return this.http.patch<void>(`${this.apiServerUrl}/phases?fitok=${name}`, fitok).pipe(
    map((response) => response)
  );
}

addFitok(name:string, fitok:Fitok) :Observable<void> {

  return this.http.post<void>(`${this.apiServerUrl}/phases?fitok=${name}`, fitok).pipe(
    map((response) => response)
  );
}
}
