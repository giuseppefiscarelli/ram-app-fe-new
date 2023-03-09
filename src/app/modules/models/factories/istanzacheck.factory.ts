import { IstanzaCheckDescriptorInterface } from './../../../config/network/api.descriptors';
import { IstanzaCheck } from './../istanzacheck.model';


export class IstanzaCheckFactory{
    static create(descriptor: IstanzaCheckDescriptorInterface): IstanzaCheck{

        const istance: IstanzaCheck = new IstanzaCheck();
        const keysToDuplicate = [
            'id',
            'id_ram',
            'dimImpresa',
            'noteDimImpresa',
            'rete',
            'pmi',
            'pec',
            'notePec',
            'firma',
            'noteFirma',
            'doc',
            'noteDoc',
            'contratto',
            'noteContratto',
            'delega',
            'noteDelega',
            'totContributo'
        ];
        keysToDuplicate.forEach(key => istance[key] = descriptor[key]);
        return istance;
    }
}
