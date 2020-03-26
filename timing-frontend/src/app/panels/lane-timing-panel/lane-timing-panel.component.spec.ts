// - CORE
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
// - TESTING
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
// - PROVIDERS
import { LaneTimingPanelComponent } from './lane-timing-panel.component';
import { LaneTimingData } from 'src/app/domain/LaneTimingData.domain';
import { DSPusherService } from 'src/app/services/dspusher.service';
import { SupportDSPusherService } from 'src/app/testing/support/SupportDSPusher.service';
import { SupportService } from 'src/app/testing/support/SupportService';
import { SpeechModeType } from 'src/app/domain/interfaces/SpeechModeType.enum';
import { DSTransmissionRecord } from 'src/app/domain/dto/DSTransmissionRecord.dto';
import { DSTimingRecord } from 'src/app/domain/dto/DSTimingRecord.dto';
import { LapTimeRecord } from 'src/app/domain/LapTimeRecord.domain';

fdescribe('PANEL LaneTimingPanelComponent [Module: PANELS]', () => {
    let fixture: ComponentFixture<LaneTimingPanelComponent>;
    let component: LaneTimingPanelComponent;
    let supportService: SupportService;
    let dsService: SupportDSPusherService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                LaneTimingPanelComponent,
            ],
            providers: [
                { provide: DSPusherService, useClass: SupportDSPusherService },
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(LaneTimingPanelComponent);
        component = fixture.componentInstance;
        supportService = TestBed.get(SupportService);
        dsService = TestBed.get(DSPusherService);
    });

    // - C O N S T R U C T I O N   P H A S E
    describe('Construction Phase', () => {
        it('Should be created', () => {
            console.log('><[panels/LaneTimingPanelComponent]> should be created');
            expect(component).toBeDefined('component has not been created.');
        });
    });

    // - C O D E   C O V E R A G E   P H A S E
    describe('Code Coverage Phase [getters]', () => {
        // let componentAsAny = component as any;
        it('isPanelClean: validate if the panel is clear and not used field', () => {
            component.laneData = new LaneTimingData();
            const obtained = component.isPanelClean();
            const expected = true;
            expect(obtained).toBe(expected);
        });
        it('getSpeechMode: validate the sound mode selected field', () => {
            const obtained = component.getSpeechMode();
            expect(obtained).toBe('MUTED');
            let componentAsAny = component as any;
            componentAsAny.speechState = 4;
            expect(component.getSpeechMode()).toBe(SpeechModeType.ACTIVE);
        });
        it('getFastestLap: validate the valie for the fastest lap', () => {
            let componentLap = TestBed.createComponent(LaneTimingPanelComponent).componentInstance;
            expect(componentLap.getFastestLap()).toBe('-');
            // Insert data and check the values after.
            let componentAsAny = componentLap as any;
            componentAsAny.laneData = new LaneTimingData().setLaneNumber(2);
            // Insert data and check the values before reset.
            let eventQueue: Subject<DSTransmissionRecord> = dsService.accessEventSource();
            let event: DSTransmissionRecord = new DSTransmissionRecord({
                transmissionSequence: 1,
                dsModel: 'DS300',
                laneNumber: 2,
                numberOfLaps: 3,
                timingData: new DSTimingRecord({
                    hours: 0,
                    minutes: 0,
                    seconds: 16,
                    fraction: 6785
                })
            });
            eventQueue.next(event);
            expect(componentAsAny.laneData.lapCount).toBe(1, 'Expected the lane count to be 1');
            expect(componentAsAny.laneIsBestTime).toBeTrue();
            expect(componentLap.getFastestLap()).toBe('1', 'Expected the fastest lap to be 1');
        });
        fit('getTimeRecords: get the list of records to be rendered', () => {
            let componentLap = TestBed.createComponent(LaneTimingPanelComponent).componentInstance;
            expect(componentLap.getFastestLap()).toBe('-');
            // Insert data and check the values after.
            let componentAsAny = componentLap as any;
            componentAsAny.laneData = new LaneTimingData().setLaneNumber(2);
            // Insert data and check the values before reset.
            let eventQueue: Subject<DSTransmissionRecord> = dsService.accessEventSource();
            let event1: DSTransmissionRecord = new DSTransmissionRecord({
                transmissionSequence: 1,
                dsModel: 'DS300',
                laneNumber: 2,
                numberOfLaps: 3,
                timingData: new DSTimingRecord({
                    hours: 0,
                    minutes: 0,
                    seconds: 16,
                    fraction: 6785
                })
            });
            eventQueue.next(event1);
            let event2: DSTransmissionRecord = new DSTransmissionRecord({
                transmissionSequence: 2,
                dsModel: 'DS300',
                laneNumber: 2,
                numberOfLaps: 4,
                timingData: new DSTimingRecord({
                    hours: 0,
                    minutes: 0,
                    seconds: 15,
                    fraction: 6785
                })
            });
            eventQueue.next(event2);
            expect(componentAsAny.laneData.lapCount).toBe(2, 'Expected the lane count to be 2');
            expect(componentAsAny.laneIsBestTime).toBeTrue();
            expect(componentLap.getFastestLap()).toBe('2', 'Expected the fastest lap to be 2');
            const records: LapTimeRecord[] = componentLap.getTimeRecords();
            expect(records[0].getTime()).toBe('16.6785', 'Expected time value for the first lap');
            expect(records[1].getTime()).toBe('15.6785', 'Expected time value for the first lap');
        });
    });
    describe('Code Coverage Phase [reset]', () => {
        it('reset: validate the reset of the lane data field', () => {
            let componentAsAny = component as any;
            componentAsAny.laneData = new LaneTimingData().setLaneNumber(2);
            // Insert data and check the values before reset.
            let eventQueue: Subject<DSTransmissionRecord> = dsService.accessEventSource();
            let event: DSTransmissionRecord = new DSTransmissionRecord({
                transmissionSequence: 1,
                dsModel: 'DS300',
                laneNumber: 2,
                numberOfLaps: 3,
                timingData: new DSTimingRecord()
            });
            eventQueue.next(event);
            eventQueue.next(event);
            expect(componentAsAny.laneData.lapCount).toBe(2);
            // Reset
            component.reset();
            expect(componentAsAny.laneData.lapCount).toBe(0);
            expect(componentAsAny.speechMode).toBe(SpeechModeType.MUTED);
            expect(componentAsAny.speechActive).toBe(false);
        });
    });
    describe('Code Coverage Phase [toggleSpeech]', () => {
        it('toggleSpeech: validate the change of the speech field', () => {
            expect(component.getSpeechMode()).toBe(SpeechModeType.MUTED);
            component.toggleSpeech();
            expect(component.getSpeechMode()).toBe(SpeechModeType.ACTIVE);
            component.toggleSpeech();
            expect(component.getSpeechMode()).toBe(SpeechModeType.OFF);
            component.toggleSpeech();
            expect(component.getSpeechMode()).toBe(SpeechModeType.MUTED);
        });
    });
});
