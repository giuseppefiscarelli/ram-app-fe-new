import { RendicontazioneDescriptorInterface } from './../../../config/network/api.descriptors';

import {  Rendicontazione } from './../istanza.model';

export class RendicontazioneFactory{
    static create(descriptor: RendicontazioneDescriptorInterface): Rendicontazione{
        const istance: Rendicontazione = new Rendicontazione();
        const keysToDuplicate = [
            'id',
            'id_ram',
            'enable',
            'userEnable',
            'status',
            'dateDisable',
            'userDisable',
            'dateStart',
            'dateEnd',
            'canceled',
            'dateCanceled',
            'userCanceled',
            'noteCanceled'
        ];

        keysToDuplicate.forEach(key=> {
            istance[key] = descriptor[key];
        });
        return istance;
    }
}
