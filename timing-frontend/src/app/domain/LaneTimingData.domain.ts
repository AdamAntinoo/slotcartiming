// - CORE
import { formatNumber } from '@angular/common';
// - DOMAIN
import { global } from './SlotTimingConstants.const';
import { LapTimeRecord } from './LapTimeRecord.domain';
import { DSTransmissionRecord } from './dto/DSTransmissionRecord.dto';
import { MessageBlock } from './MessageBlock.domain';
import { MessageTypes } from './interfaces/MessageTypes.enum';

export class LaneTimingData {
    public clean: boolean = true; // true if the timing data is not initialized
    public lane: number = 0;
    public lapCount: number = 0;
    public lapSplitCount: number = 0;
    public bestSplitTime: number = global.MAX_LAP_TIME;
    public lapTimeRecords: LapTimeRecord[] = [];
    public bestTime: LapTimeRecord = new LapTimeRecord();
    public bestLap: number = 0;
    public averageTime: number = 0.0;
    public averageChange: string = '-EQUAL-';
    private previousAverageTime: number = global.MAX_LAP_TIME;
    private rawTimingData: DSTransmissionRecord[] = [];

    // - A P I
    public processEvent(event: DSTransmissionRecord): MessageBlock {
        this.clean = false;
        this.lapCount++; // Update the lap count.
        this.rawTimingData.push(event);
        let timeRecord = this.extractTime(event); // Get the lap time.
        let newTimeRecord = new LapTimeRecord({
            lap: this.lapCount,
            time: timeRecord,
            bestTime: false
        });
        this.lapTimeRecords.push(newTimeRecord);
        this.detectIncidence(newTimeRecord);

        // Update averages and other data.
        let better: boolean = this.detectBestTime(timeRecord, newTimeRecord);
        if (better) this.bestLap = this.lapCount;
        this.averageTime = this.calculateAverageTime(this.lapTimeRecords);
        this.averageChange = this.detectAverageChange(this.averageTime);
        if (better) return new MessageBlock({
            messageType: MessageTypes.FAST_LAP,
            message: this.speechGenerator(event, better)
        });
        else return new MessageBlock({
            messageType: MessageTypes.LAP_TIME,
            message: this.speechGenerator(event, better)
        });
    }
    public cleanData(): void {
        this.lapCount = 0;
        this.lapSplitCount = 0;
        this.bestSplitTime = global.MAX_LAP_TIME;
        this.lapTimeRecords = [];
        this.bestTime = new LapTimeRecord();
        this.averageTime = 0.0;
        this.averageChange = '-EQUAL-';
        this.previousAverageTime = global.MAX_LAP_TIME;
        // Transmit this data before clearing.
        this.rawTimingData = [];
        this.clean = true;
    }
    // - G E T T E R S   &   S E T T E R S
    public setLaneNumber(lane: number): LaneTimingData {
        this.lane = lane;
        return this;
    }
    public getLane(): number {
        return this.lane;
    }
    public getBestTime(): string {
        if (this.bestTime.time == global.MAX_LAP_TIME) return '-.-';
        return formatNumber(this.bestTime.time, 'en-US', '2.3-4');
    }
    public getBestSplitTime(): string {
        if (this.bestSplitTime == global.MAX_LAP_TIME) return '-.-';
        return formatNumber(this.bestSplitTime, 'en-US', '2.3-4');
    }
    public getAverageTime(): string {
        if (this.averageTime == 0.0) return '-.-';
        return formatNumber(this.averageTime, 'en-US', '2.3-4');
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
            if (record.time < global.INCIDENCE_LAP_TIME_LIMIT) {
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
        if (this.previousAverageTime == global.MAX_LAP_TIME) this.previousAverageTime = averageDetect;
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
        console.log('[LaneTimingData.detectIncidence]> Time: ' + timeRecord.time);
        if (timeRecord.time > global.INCIDENCE_LAP_TIME_LIMIT) {
            console.log('[LaneTimingData.detectIncidence]> Incidence detected.');
            this.lapSplitCount = 0;
            this.bestSplitTime = global.MAX_LAP_TIME;
        } else {
            this.lapSplitCount++;
            if (timeRecord.time < this.bestSplitTime) this.bestSplitTime = timeRecord.time;
        }
    }
    private speechGenerator(event: DSTransmissionRecord, better: boolean): string {
        let message = ',Pista ' + this.lane + ',, - ';
        if (better)
            message = message + ', vuelta rápida, ';
        message = message + event.timingData.seconds + 'coma';
        message = message + Math.floor(event.timingData.fraction / 100);
        return message;
    }
    private detectBestTime(currentTime: number, newTime: LapTimeRecord): boolean {
        let better: boolean = false;
        if (currentTime < this.bestTime.time) {
            this.bestTime = newTime;
            better = true;
            this.cleanBestTime(); // Remove the best time flag from all other records.
            newTime.bestTime = true;
        }
        return better;
    }
    private cleanBestTime(): void {
        for (let record of this.lapTimeRecords)
            record.bestTime = false;
    }
}
