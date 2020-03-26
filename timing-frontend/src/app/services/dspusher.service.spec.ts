// - CORE
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
// - TESTING
import { async } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { inject } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
// - PROVIDERS
import { SupportService } from '../testing/support/SupportService';
import { DSPusherService } from "./dspusher.service";
import { AnyARecord } from 'dns';
import { DSTransmissionRecord } from '../domain/dto/DSTransmissionRecord.dto';
import { DSTimingRecord } from '../domain/dto/DSTimingRecord.dto';
import { doesNotReject } from 'assert';

xdescribe('SERVICE DSPusherService [Module: SERVICES]', () => {
    let service: DSPusherService;
    // let fixture: ComponentFixture<DSPusherService>;
    let supportService: SupportService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
            ],
            declarations: [
            ],
            providers: [
                { provide: SupportService, useClass: SupportService },
            ]
        })
            .compileComponents();
        // fixture = TestBed.createComponent(DSPusherService);
        // service = TestBed.get(DSPusherService);
        supportService = TestBed.get(SupportService);
    });

    // - C O N S T R U C T I O N   P H A S E
    describe('Construction Phase', () => {
        it('Should be created', () => {
            console.log('><[app/BackendService]> should be created');
            service = TestBed.get(DSPusherService);
            expect(service).toBeTruthy('component has not been created.');
        });

        it('Validate construction phase', () => {
            console.log('><[core/LoginValidationPageComponent]> Validate construction phase');
            service = TestBed.get(DSPusherService);
            expect(service).toBeTruthy('component has not been created.');
            let serviceAsAny = service as any;
            expect(serviceAsAny.socket).toBeDefined();
            expect(serviceAsAny.dsTimingSubject).toBeDefined();
        });

    });

    // - C O D E   C O V E R A G E   P H A S E
    describe('Code Coverage Phase [accessEventSource]', () => {
        let eventQueue: Subject<DSTransmissionRecord> = new Subject<DSTransmissionRecord>();
        let event: DSTransmissionRecord = new DSTransmissionRecord({
            transmissionSequence: 1,
            dsModel: 'DS300',
            laneNumber: 2,
            numberOfLaps: 3,
            timingData: new DSTimingRecord()
        });
        it('accessEventSource.success: get the socket transmission subject', (done) => {
            setTimeout(function () {
                console.log('--[accessEventSource]> Generating event it');
                eventQueue.next(event);
                done();
            }, 2500);
            service = TestBed.get(DSPusherService);
            spyOn(service, 'accessEventSource').and.returnValue(eventQueue);
            service.accessEventSource()
                .subscribe(response => {
                    console.log('--[accessEventSource]> response: ' + JSON.stringify(response));
                    expect(response).toBeDefined();
                    expect(response.transmissionSequence > 0).toBeTrue();
                    // done();
                });
            expect(service).toBeDefined();
        });
    });
});
