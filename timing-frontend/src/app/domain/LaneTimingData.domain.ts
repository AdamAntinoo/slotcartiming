// - DOMAIN
import { LapTimeRecord } from './LapTimeRecord.domain';

export class LaneTimingData {
    public lane: number = 0;
    public lapCount: number = 0;
    public lapReset: number = 0;
    public lapTimeRecords: LapTimeRecord[] = [];
    public bestTime: LapTimeRecord = new LapTimeRecord();
    public averageTime: number;

    // - G E T T E R S   &   S E T T E R S
    public setLaneNumber(lane: number): LaneTimingData {
        this.lane = lane;
        return this;
    }
    public getLapCount(): string {
        if (this.lapCount == 0) return '-';
        if ((this.lapCount - this.lapReset) == 0) return '-';
        return this.lapCount - this.lapReset;
    }
}
