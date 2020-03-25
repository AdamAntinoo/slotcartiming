// - DOMAIN
import { DSTransmissionRecord } from './DSTransmissionRecord.dto';
import { DSTimingRecord } from './DSTimingRecord.dto';

describe('CLASS DSTransmissionRecord [Module: DTO]', () => {
    // - C O N S T R U C T I O N   P H A S E
    describe('Construction Phase', () => {
        it('Should be created', () => {
            console.log('><[dto/DSTransmissionRecord]> Should be created');
            expect(new DSTransmissionRecord()).toBeTruthy();
        });
        it('Should be created with constructor', () => {
            console.log('><[dto/DSTransmissionRecord]> Should be created with constructor');
            const transmissionRecord = new DSTransmissionRecord({
                transmissionSequence: 1,
                dsModel: 'DS300',
                laneNumber: 2,
                numberOfLaps: 3,
                timingData: new DSTimingRecord()
            });
            expect(transmissionRecord).toBeDefined();
            expect(transmissionRecord.transmissionSequence).toBe(1);
            expect(transmissionRecord.dsModel).toBe('DS300');
            expect(transmissionRecord.laneNumber).toBe(2);
            expect(transmissionRecord.numberOfLaps).toBe(3);
            expect(transmissionRecord.timingData).toBeDefined();
        });
    });
});
