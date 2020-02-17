// - CORE
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import * as socketIo from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
// - DOMAIN
import { DSTransmissionRecord } from '../domain/dto/DSTransmissionRecord.dto';
import { Socket } from '../domain/interfaces/socket.io.interface';

// const Pusher: any;
const DS_EVENT_CHANNEL_NAME = 'ds-events-channel';
const DS_EVENT_NAME = 'ds-timing-data';
const SOURCE_PORT = 3300;

@Injectable({
    providedIn: 'root'
})
export class DSPusherService {
    private dsTimingSubject: Subject<DSTransmissionRecord> = new Subject<DSTransmissionRecord>();
    private dsPusher: any;
    private dsChannel: any;
    private socket: Socket;
    // private observer: Observer;

    constructor() {
        this.connectToSource();
        //     // Inject the event to the subject to be consumed by all lane timers.
        //     this.dsTimingSubject.next(event);
        // });
    }
    private connectToSource() {
        console.log('>[DSPusherService.connectToSource]');
        this.socket = socketIo('http://localhost:' + SOURCE_PORT);

        this.socket.on(DS_EVENT_NAME, (data) => {
            console.log('-[DSPusherService.connectToSource]> Received data: ' + JSON.stringify(data));
            let event: DSTransmissionRecord = new DSTransmissionRecord(data);
            this.dsTimingSubject.next(event);
        });
    }
}
