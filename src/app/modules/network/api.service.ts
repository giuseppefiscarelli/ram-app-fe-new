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
    public TokenAuth: any;
    public Users: any;
    public Subjects: any;

    public ProductCategories: any;
    public Discounts: any;
    public DiscountCategories: any;
    public DiscountClasses: any;

    public CheckCf: any;
    public GetCap: any;

    public Upload: any;
    public Download: any;
    public Attachments: any;
    public TypeDocument: any;
    public TypeInstance: any;
    public Istanza: any;
    public Veicolo: any;
    public Allegato: any;
    public Rendicontazione: any;

    public IstanzaCheck: any;

    public Report: any;
    public TypeReport: any;
    constructor(private http: HttpClient) {
        this.url = environment.endpoint || `${window.location.protocol}//${window.location.host}`;
        this.url += environment.baseApi || '';
        //console.log(this.url);
        this.Authentication = this.constructApisForGroup('Authentication');
        this.TokenAuth = this.constructApisForGroup('TokenAuth');
        this.Users = this.constructApisForGroup('Users');
        this.Subjects = this.constructApisForGroup('Subjects');

        this.ProductCategories = this.constructApisForGroup('ProductCategories');
        this.Discounts = this.constructApisForGroup('Discounts');
        this.DiscountCategories = this.constructApisForGroup('DiscountCategories');
        this.DiscountClasses = this.constructApisForGroup('DiscountClasses');

        this.CheckCf = this.constructApisForGroup('CheckCf');
        this.GetCap = this.constructApisForGroup('GetCap');

        this.Upload = this.constructApisForGroup('Upload');
        this.Download = this.constructApisForGroup('Download');
        this.Attachments = this.constructApisForGroup('Attachments');
        this.TypeDocument = this.constructApisForGroup('TypeDocument');
        this.TypeInstance = this.constructApisForGroup('TypeInstance');
        this.Istanza = this.constructApisForGroup('Istanza');
        this.Veicolo = this.constructApisForGroup('Veicolo');
        this.Allegato = this.constructApisForGroup('Allegato');
        this.Rendicontazione = this.constructApisForGroup('Rendicontazione');
        this.IstanzaCheck = this.constructApisForGroup('IstanzaCheck');
        this.Report = this.constructApisForGroup('Report');
        this.TypeReport = this.constructApisForGroup('TypeReport');

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
