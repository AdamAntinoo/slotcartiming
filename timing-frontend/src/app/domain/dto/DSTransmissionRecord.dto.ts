// - DOMAIN
import { DSTimingRecord } from './DSTimingRecord.dto';

export class DSTransmissionRecord {
    public transmissionSequence: number;
    public dsModel: string = 'DS300';
    public laneNumber: number;
    public numberOfLaps: number;
    public timingData: DSTimingRecord;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
