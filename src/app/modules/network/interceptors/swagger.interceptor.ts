import * as Definitions from '@configs/network/api.definitions';
import { isExcludedFromHandling } from '@configs/network/api.exclusions';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpParams } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class SwaggerInterceptor implements HttpInterceptor {
    static readonly formData: string = 'multipart/form-data';

    constructor(private router: Router) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isExcludedFromHandling(request.url)) {
            return next.handle(request);
        }

        let clonedRequest = null;

        try {
            const definedHostname = environment.endpoint || `${window.location.protocol}//${window.location.host}`;
            let baseApi = environment.baseApi || '';
            baseApi = (baseApi.endsWith('/') && baseApi.startsWith('/')) ? baseApi.substr(1) : baseApi;
            const basePath = environment.baseApi ? `${definedHostname}/${baseApi}` : definedHostname;

            const currentPath = request.url;
            const currentMethod = request.method.toLowerCase();
            const currentData = this.extractRequestParams(request);
            const descriptor = Definitions.paths[currentPath][currentMethod];
            const missing: string[] = [];

            const uri = (basePath.endsWith('/') && currentPath.startsWith('/')) ? currentPath.substr(1) : currentPath;
            const url = this.buildRequestUrl(`${basePath}${uri}`, currentData, missing, descriptor);

            if (!url) {
                const error = `Missing required parameters ${missing.join(', ')} for operation ${descriptor.operationId}`;

                return observableThrowError(new Error(error));
            }

            if (currentMethod === 'get' || currentMethod === 'delete') {
                clonedRequest = request.clone({
                    url,
                    params: this.buildRequestParams(currentData)
                });
            } else {
                clonedRequest = request.clone({
                    url,
                    body: this.buildBodyParams(currentData, descriptor)
                });
            }
        } catch (exception) {
            clonedRequest = request.clone();
        }

        return next.handle(clonedRequest);
    }

    private buildRequestUrl(url: string, data: any, missing: string[], descriptor: any): string {
        let complete: string = url;

        const regex = /{(\w+)}/g;
        const parameters = {
            required: [],
            missing: []
        };

        // Checking if path parameters are present
        if (complete.match(regex)) {
            let matches = [];

            // tslint:disable-next-line:no-conditional-assignment
            while (matches = regex.exec(complete)) {
                parameters.required.push(matches[1]);

                if (!data || !data[matches[1]]) {
                    parameters.missing.push(matches[1]);
                }
            }
        }

        // Checking missing parameters. If at least one exists we'll return an always throwable exception
        if (parameters.missing.length > 0) {
            missing.push(...parameters.missing);

            return null;
        }

        // If exists at least a required parameter
        if (parameters.required.length > 0) {
            parameters.required.forEach(parameter => {
                complete = complete.replace(`{${parameter}}`, data[parameter]);

                delete data[parameter];
            });
        }

        return complete;
    }

    private buildBodyParams(data: any, descriptor: any): any {
        const blobs = [];
        let body: any = data;

        if (descriptor.requestBody != null &&
            descriptor.requestBody.content &&
            descriptor.requestBody.content[SwaggerInterceptor.formData] != null) {

            body = new FormData();

            Object.keys(data).forEach((key: string) => {
                if (data[key] instanceof Array) {
                    body.append(key, JSON.stringify(data[key]));
                } else if (data[key] instanceof FileList) {
                    Array.from(data[key]).forEach(file => {
                        body.append(key, file);
                    });
                } else if (data[key] instanceof Blob) {
                    blobs.push({ key, blob: data[key] });
                } else {
                    body.append(key, data[key]);
                }
            });

            blobs.forEach((item: any) => {
                const extension = item.blob.name.substring(item.blob.name.lastIndexOf('.'));
                body.append(item.key, item.blob, (new Date().getTime().toString()) + extension);
            });
        }

        return body;
    }

    private extractRequestParams(request: HttpRequest<any>): { [key: string]: any } {
        let data = {};

        if (['get', 'delete'].indexOf(request.method.toLowerCase()) >= 0) {
            request.params.keys().forEach(key => data[key] = request.params.get(key));
        } else {
            data = request.body;
        }

        return data;
    }


    private buildRequestParams(data: any): HttpParams {
        const requestParams: string[] = [];

        Object.keys(data).forEach((key) => {
            requestParams.push(`${key}=${data[key]}`);
        });

        return new HttpParams({
            fromString: requestParams.join('&')
        });
    }
}
