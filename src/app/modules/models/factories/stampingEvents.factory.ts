import { StampingEventsDescriptorInterface } from './../../../config/network/api.descriptors';

import { StampingEvent } from './../stampingEvent.model';


export class StampingEventsFactory {
    static create(descriptor : StampingEventsDescriptorInterface): StampingEvent{
        const instance: StampingEvent = new StampingEvent();
        const keysToDuplicate = [
          'id',
          'idDip',
          'desDip',
          'start',
          'end',
          'ordinary',
          'absence',
          'surplus',
          'type',
          'day',
          'month',
          'year',
          'note',
          'other',
          'just',
          'idTask',
          'idProject',
          'status'
        ];
        keysToDuplicate.forEach(key => instance[key] = descriptor[key]);

        return instance;
    }
}
