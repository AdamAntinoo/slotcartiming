// - DOMAIN
import { DSTransmissionRecordType } from './DSTransmissionRecordType.enum';
import { DSFunctionType } from './DSFunctionType.enum';
import { DSTimingRecord } from './DSTimingRecord.dto';

export class DSTransmissionRecord {
    public transmissionSequence: number;
    public dsModel: string = 'DS300';
    public typeOfDSRecord: DSTransmissionRecordType = DSTransmissionRecordType.Function;
    public dsFunctionType: DSFunctionType = DSFunctionType.NotApplies;
    public laneNumber: number;
    public numberOfLaps: number;
    public timingData: DSTimingRecord;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
