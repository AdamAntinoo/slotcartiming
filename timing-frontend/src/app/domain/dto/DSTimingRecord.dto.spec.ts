// - DOMAIN
import { global } from '../SlotTimingConstants.const';
import { DSTimingRecord } from './DSTimingRecord.dto';

describe('CLASS LapTimeRecord [Module: DTO]', () => {
    // - C O N S T R U C T I O N   P H A S E
    describe('Construction Phase', () => {
        it('Should be created', () => {
            console.log('><[dto/DSTimingRecord]> Should be created');
            expect(new DSTimingRecord()).toBeTruthy();
        });
        it('Should be created with constructor', () => {
            console.log('><[dto/DSTimingRecord]> Should be created with constructor');
            const timingRecord = new DSTimingRecord({
                hours: 1,
                minutes: 2,
                seconds: 3,
                fraction: 4.5
            });
            expect(timingRecord).toBeTruthy();
            expect(timingRecord.hours).toBe(1);
            expect(timingRecord.minutes).toBe(2);
            expect(timingRecord.seconds).toBe(3);
            expect(timingRecord.fraction).toBe(4.5);
        });
    });
});
