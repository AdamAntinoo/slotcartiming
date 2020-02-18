// - DOMAIN
import { LapTimeRecord } from './LapTimeRecord.domain';
import { DSTransmissionRecord } from './dto/DSTransmissionRecord.dto';
import { formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';

const FAILED_LAP_TIME_LIMIT = 40.0;

export class LaneTimingData {
    public clean: boolean = true;
    public lane: number = 0;
    public lapCount: number = 0;
    public lapSplitCount: number = 0;
    public bestSplitTime: number = 9999.0;
    public lapTimeRecords: LapTimeRecord[] = [];
    public bestTime: LapTimeRecord = new LapTimeRecord();
    public averageTime: number = 0.0;

    // - G E T T E R S   &   S E T T E R S
    public setLaneNumber(lane: number): LaneTimingData {
        this.lane = lane;
        return this;
    }
    public getBestTime(): string {
        if (this.bestTime.time == 9999.0) return '-.-';
        return formatNumber(this.bestTime.time, 'es-ES', '2.4-4');
    }
    public getBestSplitTime(): string {
        if (this.bestSplitTime == 9999.0) return '-.-';
        return this.bestSplitTime + '';
    }
    public getAverageTime(): string {
        if (this.averageTime == 0.0) return '-.-';
        return formatNumber(this.averageTime, 'es-ES', '2.4-4');
    }
    public processEvent(event: DSTransmissionRecord): void {
        this.clean = false;
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
