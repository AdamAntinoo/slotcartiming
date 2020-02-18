// - CORE
import { formatNumber } from '@angular/common';
// - DOMAIN
import { LapTimeRecord } from './LapTimeRecord.domain';
import { DSTransmissionRecord } from './dto/DSTransmissionRecord.dto';

const INCIDENCE_LAP_TIME_LIMIT = 40.0;

export class LaneTimingData {
    public clean: boolean = true; // true if the timing data is not initialized
    public lane: number = 0;
    public lapCount: number = 0;
    public lapSplitCount: number = 0;
    public bestSplitTime: number = 9999.0;
    public lapTimeRecords: LapTimeRecord[] = [];
    public bestTime: LapTimeRecord = new LapTimeRecord();
    public averageTime: number = 0.0;
    public averageChange: string = '-EQUAL-';
    private previousAverageTime: number = 999;
    private rawTimingData: DSTransmissionRecord[] = [];

    // - A P I
    public processEvent(event: DSTransmissionRecord): string {
        this.clean = false;
        this.lapCount++; // Update the lap count.
        this.rawTimingData.push(event);
        let timeRecord = this.extractTime(event); // Get the lap time.
        let newTimeRecord = new LapTimeRecord({
            lap: this.lapCount,
            time: timeRecord
        });
        this.lapTimeRecords.push(newTimeRecord);
        this.detectIncidence(newTimeRecord);

        // Update averages and other data.
        let better: boolean = false;
        if (timeRecord < this.bestTime.time) {
            this.bestTime = newTimeRecord;
            better = true;
        }
        this.averageTime = this.calculateAverageTime(this.lapTimeRecords);
        this.averageChange = this.detectAverageChange(this.averageTime);
        return this.speechGenerator(event, better);
    }
    public cleanData(): void {
        this.lapCount = 0;
        this.lapSplitCount = 0;
        this.bestSplitTime = 9999.0;
        this.lapTimeRecords = [];
        this.bestTime = new LapTimeRecord();
        this.averageTime = 0.0;
        this.averageChange = '-EQUAL-';
        this.previousAverageTime = 999;
        // Transmit this data before clearing.
        this.rawTimingData = [];
        this.clean = true;
    }
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
    public getAverageChange(): string {
        return this.averageChange;
    }
    private extractTime(event: DSTransmissionRecord): number {
        return event.timingData.seconds + event.timingData.fraction / 10000;
    }
    private calculateAverageTime(records: LapTimeRecord[]): number {
        let time = 0.0;
        let count = 0;
        for (let record of records) {
            if (record.time < INCIDENCE_LAP_TIME_LIMIT) {
                time += record.time;
                count++;
            }
        }
        let average = time / count;
        return average;
    }
    private detectAverageChange(average: number): string {
        let averageDetect = Math.floor(average * 100.0);
        // Detect if average changes.
        if (this.previousAverageTime == 999) this.previousAverageTime = averageDetect;
        if (averageDetect == this.previousAverageTime) return '-EQUAL-';
        if (averageDetect > this.previousAverageTime) {
            this.previousAverageTime = averageDetect;
            return '-WORST-';
        }
        if (averageDetect < this.previousAverageTime) {
            this.previousAverageTime = averageDetect;
            return '-BETTER-';
        }
    }
    private detectIncidence(timeRecord: LapTimeRecord): void {
        if (timeRecord.time > INCIDENCE_LAP_TIME_LIMIT) {
            this.lapSplitCount = 0;
            this.bestSplitTime = 999.0;
        } else {
            this.lapSplitCount++;
            if (timeRecord.time < this.bestSplitTime) this.bestSplitTime = timeRecord.time;
        }
    }
    private speechGenerator(event: DSTransmissionRecord, better: boolean): string {
        let message = ',Pista ' + this.lane + ',, - ';
        if (better)
            message = message + ', vuelta rápida, ';
        // message = message + event.timingData.seconds + 'segundos ,,';
        // message = message + Math.floor(event.timingData.fraction / 10);
        message = message + event.timingData.seconds + 'coma';
        message = message + Math.floor(event.timingData.fraction / 10);
        return message;
    }
}
