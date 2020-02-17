// - CORE
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { DSTransmissionRecord } from '../domain/dto/DSTransmissionRecord.dto';

declare const Pusher: any;
declare const DS_EVENT_CHANNEL_NAME = 'ds-events-channel';
declare const DS_EVENT_NAME = 'my-event';

@Injectable({
    providedIn: 'root'
})
export class DSPusherService {
    private dsTimingSubject: Subject<DSTransmissionRecord> = new Subject<DSTransmissionRecord>();
    private dsPusher: any;
    private dsChannel: any;

    constructor() {
        this.dsPusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.cluster,
            forceTLS: environment.pusher.forceTLS,
            encrypted: true
        });
        this.dsChannel = this.dsPusher.subscribe(DS_EVENT_CHANNEL_NAME);
        this.dsChannel.bind(DS_EVENT_NAME, (data) => {
            // Convert the event input to the TS class.
            let event: DSTransmissionRecord = new DSTransmissionRecord(data);
            // Inject the event to the subject to be consumed by all lane timers.
            this.dsTimingSubject.next(event);
        });
    }
}
