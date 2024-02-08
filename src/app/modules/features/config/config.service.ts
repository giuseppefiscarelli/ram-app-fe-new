import { MailConfigFactory } from './../../models/factories/mailConfig.factory';
import { MailConfig } from './../../models/mailConfig.model';
import { TypeIstanceFactory } from './../../models/factories/typeIstance.factory';
import { TypeIstance } from './../../models/type-istance.model';

import { ReportsFactory } from './../../models/factories/reports.factory';
import { Report } from './../../models/report.model';
import { TypeReportsFactory } from './../../models/factories/typeReports.factory';
import { TypeReport } from './../../models/typeReport.model';
import { TypeDocumentsFactory } from './../../models/factories/typeDocuments.factory';
import { ReportDerscriptorInterface, TypeDocumentsDescriptorInterface, TypesReportDescriptorInterface, TypeIstanceDescriptorInterface, MailConfigDescriptorInterface } from './../../../config/network/api.descriptors';
import { map, Observable } from 'rxjs';
import { ApiService } from '@modules/network/api.service';
import { TypeDocument } from './../../models/typeDocument.model';
import { Injectable } from '@angular/core';


@Injectable()

export class ConfigService{
    constructor(private API: ApiService) {
    }

    fetchTypeDocuments(payload?: any): Observable<TypeDocument[]>{
        return this.API.TypeDocument.fetch(payload)
        .pipe(
            map((types: TypeDocumentsDescriptorInterface[]) =>
                types.map((type: TypeDocumentsDescriptorInterface)=>
                TypeDocumentsFactory.create(type))
            )
        );
    }
    createTypeDocument(payload: any): Observable<TypeDocument>{
        return this.API.TypeDocument.create(payload)
        .pipe(
            map((type: TypeDocumentsDescriptorInterface) =>
                TypeDocumentsFactory.create(type)
            )
        )
    }

//typereport
    createTypeReport(payload: any): Observable<TypeReport>{
        return this.API.TypeReport.create(payload)
        .pipe(
            map((type: TypesReportDescriptorInterface) =>
                TypeReportsFactory.create(type)
            )
        )
    }
    fetchTypeReport(payload?: any): Observable<TypeReport[]>{
        return this.API.TypeReport.fetch(payload)
        .pipe(
            map((types: TypesReportDescriptorInterface[]) =>
                types.map((type: TypesReportDescriptorInterface)=>
                TypeReportsFactory.create(type))
            )
        );
    }
    getTypeReport(id: string): Observable<TypeReport> {
        return this.API.TypeReport.get({id})
            .pipe(
                map((subject: TypesReportDescriptorInterface) => TypeReportsFactory.create(subject))
            );
    }
    updateTypeReport(payload: TypesReportDescriptorInterface): Observable<TypeReport> {
        return this.API.TypeReport.update(payload)
            .pipe(
                map((record: TypesReportDescriptorInterface) => TypeReportsFactory.create(record))
            );
    }


    ///report
    createReport(payload: any): Observable<Report>{
        return this.API.Report.create(payload)
        .pipe(
            map((type: ReportDerscriptorInterface) =>
                ReportsFactory.create(type)
            )
        )
    }
    fetchReport(payload?: any): Observable<Report[]>{
        return this.API.Report.fetch(payload)
        .pipe(
            map((types: ReportDerscriptorInterface[]) =>
                types.map((type: ReportDerscriptorInterface)=>
                ReportsFactory.create(type))
            )
        );
    }
    getReport(id: string): Observable<Report> {
        return this.API.Report.get({id})
            .pipe(
                map((subject: ReportDerscriptorInterface) => ReportsFactory.create(subject))
            );
    }
    updateReport(payload: any): Observable<Report> {
        return this.API.Report.update(payload)
            .pipe(
                map((record: ReportDerscriptorInterface) => ReportsFactory.create(record))
            );
    }

    //mailconfig
    fetchMailConfig(payload?: any): Observable<MailConfig[]>{
        return this.API.MailConfig.fetch(payload)
        .pipe(
            map((records: MailConfigDescriptorInterface[]) =>
            records.map((record: MailConfigDescriptorInterface) =>
            MailConfigFactory.create(record)))
        )
    }
    createMailConfig(payload: any): Observable<MailConfig>{
        return this.API.MailConfig.create(payload)
        .pipe(
            map((record: MailConfigDescriptorInterface) =>
            MailConfigFactory.create(record)
            )
        )
    }
    getMailConfig(id: string): Observable<MailConfig> {
        return this.API.MailConfig.get({id})
            .pipe(
                map((record: MailConfigDescriptorInterface) => MailConfigFactory.create(record))
            );
    }
    updateMailConfig(payload: MailConfigDescriptorInterface): Observable<MailConfig> {
        return this.API.MailConfig.update(payload)
            .pipe(
                map((record: MailConfigDescriptorInterface) => MailConfigFactory.create(record))
            );
    }

    //typeinstance
    fetchTypeInstance(payload?: any): Observable<TypeIstance[]>{
      return this.API.TypeInstance.fetch(payload)
      .pipe(
          map((records: TypeIstanceDescriptorInterface[]) =>
          records.map((record: TypeIstanceDescriptorInterface) =>
          TypeIstanceFactory.create(record)))
      )
  }
  createTypeInstance(payload: any): Observable<TypeIstance>{
      return this.API.TypeInstance.create(payload)
      .pipe(
          map((type: TypeIstanceDescriptorInterface) =>
          TypeIstanceFactory.create(type)
          )
      )
  }
  getTypeInstance(id: string): Observable<TypeIstance> {
      return this.API.TypeInstance.get({id})
          .pipe(
              map((subject: TypeIstanceDescriptorInterface) => TypeIstanceFactory.create(subject))
          );
  }
  updateTypeInstance(payload: TypeIstanceDescriptorInterface): Observable<TypeIstance> {
      return this.API.TypeInstance.update(payload)
          .pipe(
              map((record: TypeIstanceDescriptorInterface) => TypeIstanceFactory.create(record))
          );
  }
}
