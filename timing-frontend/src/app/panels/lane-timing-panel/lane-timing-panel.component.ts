// - CORE
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Subscription } from 'rxjs';
// - SERVICES
import { DSPusherService } from 'src/app/services/dspusher.service';
// - DOMAIN
import { LaneTimingData } from 'src/app/domain/LaneTimingData.domain';
import { DSTransmissionRecord } from 'src/app/domain/dto/DSTransmissionRecord.dto';
import { SpeechSynthesisUtteranceFactoryService } from '@kamiazya/ngx-speech-synthesis';
import { SpeechSynthesisService } from '@kamiazya/ngx-speech-synthesis';
import { LapTimeRecord } from 'src/app/domain/LapTimeRecord.domain';
import { SpeechModeType } from 'src/app/domain/interfaces/SpeechModeType.enum';
import { environment } from 'src/environments/environment';
import { MessageBlock } from 'src/app/domain/MessageBlock.domain';
import { MessageTypes } from 'src/app/domain/interfaces/MessageTypes.enum';

@Component({
    selector: 'app-lane-timing-panel',
    templateUrl: './lane-timing-panel.component.html',
    styleUrls: ['./lane-timing-panel.component.scss'],
    providers: [SpeechSynthesisUtteranceFactoryService]
})
export class LaneTimingPanelComponent {
    @Input() laneData: LaneTimingData;
    public speechState: number = 3;
    public laneIsBestTime: boolean = false;
    private eventSource: Subscription; //  The connection to the timing event source.
    // private speechMode: SpeechModeType = SpeechModeType.MUTED;
    private bestTime: number = 999.0;
    public fastLap: number = 1;

    constructor(
        protected dsDataService: DSPusherService,
        protected speechFactory: SpeechSynthesisUtteranceFactoryService,
        protected speechService: SpeechSynthesisService) {
        this.eventSource = this.dsDataService.accessEventSource()
            .subscribe((event: DSTransmissionRecord) => {
                // Process only events for this lane.
                console.log('-[LaneTimingPanelComponent]> event: ' + JSON.stringify(event));
                console.log('-[LaneTimingPanelComponent]> target lane: ' + event.laneNumber);
                if (event.laneNumber == this.laneData.lane) {
                    let message: MessageBlock = this.laneData.processEvent(event);
                    if (this.getSpeechMode() === SpeechModeType.ACTIVE)
                        this.speechService.speak(this.speechFactory.text(message.message));
                    if ((this.getSpeechMode() === SpeechModeType.MUTED) && (message.messageType == MessageTypes.FAST_LAP))
                        this.speechService.speak(this.speechFactory.text(message.message));
                }
                this.updateBestTime(event); // Ths has to be processed by all lanes.
            });
    }
    public isPanelClean(): boolean {
        return this.laneData.clean;
    }
    public reset(): void {
        this.laneData.cleanData();
        // this.speechActive = false;
        // this.speechMode = SpeechModeType.MUTED;
        this.speechState = 1;
    }
    public toggleSpeech(): void {
        // this.speechActive = !this.speechActive;
        this.speechState++;
        if (this.speechState > 3) this.speechState = 1;
    }
    public getSpeechMode(): string {
        if (this.speechState === 1) return SpeechModeType.MUTED;
        if (this.speechState === 2) return SpeechModeType.ACTIVE;
        if (this.speechState === 3) return SpeechModeType.OFF;
        return SpeechModeType.ACTIVE;
    }
    public getFastestLap(): string {
        if (null == this.laneData) return '-';
        else return this.laneData.bestLap.toString();
    }
    public getTimeRecords(): LapTimeRecord[] {
        console.log('[getTimeRecords]> records to display: ' + environment.laneRecordDisplayCount);
        let size = this.laneData.lapTimeRecords.length;
        let records: LapTimeRecord[] = [];
        if (size > environment.laneRecordDisplayCount) {
            let start = size - environment.laneRecordDisplayCount;
            let end = start + environment.laneRecordDisplayCount;
            records = this.laneData.lapTimeRecords.slice(start, end);
        } else records = this.laneData.lapTimeRecords;
        return this.reverseRecords(records);
    }
    private updateBestTime(event: DSTransmissionRecord): void {
        let time = this.extractTime(event);
        if (time < this.bestTime) {
            this.bestTime = time; // This applies to all lanes to all them identify the absolute best time.
            if (event.laneNumber == this.laneData.getLane())
                this.laneIsBestTime = true;
            else this.laneIsBestTime = false;
        }
    }
    private extractTime(event: DSTransmissionRecord): number {
        return event.timingData.seconds + event.timingData.fraction / 10000;
    }
    private reverseRecords(input: LapTimeRecord[]): LapTimeRecord[] {
        let output: LapTimeRecord[] = [];
        for (let index = input.length - 1; index >= 0; index--)
            output.push(input[index]);
        return output;
    }
}
