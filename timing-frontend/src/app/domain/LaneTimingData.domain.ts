// - DOMAIN
import { LapTimeRecord } from './LapTimeRecord.domain';
import { DSTransmissionRecord } from './dto/DSTransmissionRecord.dto';

const FAILED_LAP_TIME_LIMIT = 40.0;

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
        return this.lapCount + '';
        // if (this.lapCount == 0) return '-';
        // if ((this.lapCount - this.lapReset) == 0) return '-';
        // return (this.lapCount - this.lapReset) + '';
    }
    public processEvent(event: DSTransmissionRecord): void {
        this.lapCount++; // Update the lap count.
        let timeRecord = this.extractTime(event); // Get the lap time.
        let newTimeRecord = new LapTimeRecord({
            lap: this.lapCount,
            time: timeRecord
        });
        this.lapTimeRecords.push(newTimeRecord);

        // Update averages and other data.
        if (timeRecord < this.bestTime.time) this.bestTime = newTimeRecord;
        this.averageTime = this.calculateAverageTime(this.lapTimeRecords);
    }
    private extractTime(event: DSTransmissionRecord): number {
        return event.timingData.seconds + event.timingData.fraction / 10000;
    }
    private calculateAverageTime(records: LapTimeRecord[]): number {
        let time = 0.0;
        let count = 0;
        for (let record of records) {
            if (record.time < FAILED_LAP_TIME_LIMIT) {
                time += record.time;
                count++;
            }
        }
        return time / count;
    }
}
