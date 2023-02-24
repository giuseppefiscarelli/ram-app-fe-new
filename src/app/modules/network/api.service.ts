import * as Definitions from './../../config/network/api.definitions';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { environment } from '@env/environment';

interface ApiGroup {
    [key: string]: any;
}

@Injectable()
export class ApiService {
    readonly url: string;

    public Authentication: any;
    public Users: any;
    public Desks: any;
    public Company: any;
    public Employee: any;
    public Projects: any;
    public StampingEvent: any;
    public Task: any;


    //dev
    public FitokData: any;



    ///file
    public Upload: any;
    public Download: any;
    public Attachments: any;

    constructor(private http: HttpClient) {
        this.url = environment.endpoint || `${window.location.protocol}//${window.location.host}`;
        this.url += environment.baseApi || '';
        //console.log(this.url);
        this.Authentication = this.constructApisForGroup('Authentication');
        this.Users = this.constructApisForGroup('Users');
        this.Desks = this.constructApisForGroup('Desks');
        this.Company = this.constructApisForGroup('Company');
        this.Employee = this.constructApisForGroup('Employee');
        this.Projects = this.constructApisForGroup('Projects');
        this.Task = this.constructApisForGroup('Task');
        this.StampingEvent = this.constructApisForGroup('StampingEvent');
        this.FitokData = this.constructApisForGroup('FitokData');
        this.Upload = this.constructApisForGroup('Upload');
        this.Download = this.constructApisForGroup('Download');
        this.Attachments = this.constructApisForGroup('Attachments');


    }

    private constructApisForGroup(group: string): ApiGroup {
        const paths = Definitions.paths;
        const keys = Object.keys(paths);
        const apis = {};

        keys.forEach(path => {
            const descriptor = paths[path];
            const methods = Object.keys(descriptor);

            methods.forEach(method => {
                const operationId = descriptor[method].operationId;

                if (operationId && operationId.startsWith(`${group}.`)) {
                    this.constructApiFromOperation(apis, path, method, descriptor[method]);
                }
            });
        });

        return apis;
    }

    private constructApiFromOperation(root: ApiGroup, path: string, method: string, descriptor: any): ApiGroup {
        const components = descriptor.operationId.split('.');

        let clone = root;

        for (let i = 1; i < components.length - 1; i++) {
            if (!clone[components[i]]) {
                clone[components[i]] = {};
            }

            clone = clone[components[i]];
        }

        clone[components[components.length - 1]] = (data: any, options: any): Observable<any> => {
            if (method === 'get' || method === 'delete') {
                options = options || {};
                options.params = this.buildRequestParams(data);

                // Query parameters will be overwritten inside the api.interceptor
                return this.http[method](path, options).pipe(
                    take(1),
                    catchError((error: any) => {
                        if (error.error != null) {
                            error.message = error.error.message;
                            return throwError(error);
                        }
                    })
                );
            } else {
                return this.http[method](path, data, options).pipe(
                    take(1),
                    catchError((error: any) => {
                        if (error.error != null) {
                            error.message = error.error.message;
                        }
                        return throwError(error);
                    })
                );
            }
        };

        return root;
    }

    private buildRequestParams(data: any): HttpParams {
        const requestParams: string[] = [];

        if (!data) {
            return new HttpParams({});
        }

        Object.keys(data).forEach((key) => {
            requestParams.push(`${key}=${data[key]}`);
        });

        return new HttpParams({
            fromString: requestParams.join('&')
        });
    }
}
