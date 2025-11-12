import { ReportDerscriptorInterface } from './../../../config/network/api.descriptors';
import { Report } from './../report.model';

export class ReportsFactory{
    static create(descriptor: ReportDerscriptorInterface): Report{
        const instance: Report = new Report();
        const keysToDuplicate = [
            'id',
            'updatedAt',
            'createdAt',
            'userCreate',
            'userInvio',
            'dataInvio',
            'userUpload',
            'dataUpload',
            'statusInvio',
            'enable',
            'status',
            'typeReport',
            'numProt',
            'dataProt',
            'dataVerbale',
            'dataVerbaleDeduzioni',
            'ragSociale',
            'indirizzo',
            'numCivico',
            'cap',
            'citta',
            'prov',
            'pecImpresa',
            'idRam',
            'idAllegato',
            'dataIdRam',
            'year',
            'detail',
            'artAa',
            'artAb',
            'artAc',
            'artAd',
            'artB1',
            'artB2',
            'artCa',
            'artCb',
            'artCc',
            'artD',
            'totaleMaggiorazioni',
            'totaleContributo',
            'protPreavvisoRigetto',
            'dataPreavvisoRigetto',
            'dataNotaInammissibilita',
            'motivazioneInammissibilita',
            'fd',
            'body',
            'subject'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);
        return instance;

    }
}
