// - TESTING
import { TestBed } from '@angular/core/testing';
// - PROVIDERS
import { SupportService } from '../testing/support/SupportService';
// - DOMAIN
import { global } from './SlotTimingConstants.const';
import { LapTimeRecord } from './LapTimeRecord.domain';

describe('CLASS LapTimeRecord [Module: DOMAIN]', () => {
    let isolation: SupportService;

    beforeEach(() => {
        isolation = TestBed.get(SupportService);
    });
    // - C O N S T R U C T I O N   P H A S E
    describe('Construction Phase', () => {
        it('Should be created', () => {
            console.log('><[domain/LapTimeRecord]> should be created');
            expect(new LapTimeRecord()).toBeTruthy();
        });
        it('Should be created with constructor', () => {
            console.log('><[domain/LapTimeRecord]> should be created');
            const lapTimeRecord = new LapTimeRecord({
                lap: 12,
                time: 16.9878,
                bestTime: true
            });
            expect(lapTimeRecord).toBeTruthy();
            expect(lapTimeRecord.lap).toBe(12);
            expect(lapTimeRecord.getTime()).toBe('16.9878'); // WARNING - this is a Jasmine defect
            expect(lapTimeRecord.bestTime).toBeTruthy();
        });
    });
    // - C O D E   C O V E R A G E   P H A S E
    describe('Code Coverage Phase [getters]', () => {
        it('getTime.success: check the time field', () => {
            let lapTimeRecord = new LapTimeRecord();
            expect(lapTimeRecord.getTime()).toBe('-.-');
            lapTimeRecord = new LapTimeRecord({ time: global.MAX_LAP_TIME });
            expect(lapTimeRecord.getTime()).toBe('-.-');
            lapTimeRecord = new LapTimeRecord({
                lap: 12,
                time: 16.9878,
                bestTime: true
            });
            expect(lapTimeRecord.getTime()).toBe('16.9878'); // WARNING - this is a Jasmine defect
        });
    });
});
