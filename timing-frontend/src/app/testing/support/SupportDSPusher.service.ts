// - CORE
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// - DOMAIN
import { DSTransmissionRecord } from 'src/app/domain/dto/DSTransmissionRecord.dto';

@Injectable({
    providedIn: 'root'
})
export class SupportDSPusherService {
    private dsTimingSubject: Subject<DSTransmissionRecord> = new Subject<DSTransmissionRecord>();

    public accessEventSource(): Subject<DSTransmissionRecord> {
        return this.dsTimingSubject;
    }
}