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

@Component({
    selector: 'app-lane-timing-panel',
    templateUrl: './lane-timing-panel.component.html',
    styleUrls: ['./lane-timing-panel.component.scss'],
    providers: [SpeechSynthesisUtteranceFactoryService]
})
export class LaneTimingPanelComponent {
    @Input() laneData: LaneTimingData;
    private speechState: number = 1;
    private speechActive: boolean = false;
    private speechMode: SpeechModeType = SpeechModeType.MUTED;
    private laneIsBestTime: boolean = false;
    private bestTime: number = 999.0;
    private fastLap: number;
    private eventSource: Subscription;

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
                    let message: string = this.laneData.processEvent(event);
                    if (this.speechActive) this.speechService.speak(this.speechFactory.text(message));
                }
                this.updateBestTime(event); // Ths has to be processed by all lanes.
            });
    }
    public isPanelClean(): boolean {
        return this.laneData.clean;
    }
    public reset(): void {
        this.laneData.cleanData();
        this.speechActive = false;
        this.speechMode = SpeechModeType.MUTED;
        this.speechState = 1;
    }
    public toggleSpeech(): void {
        this.speechActive = !this.speechActive;
        this.speechState++;
        if (this.speechState > 3) this.speechState = 1;
    }
    public getSpeechMode(): string {
        if (this.speechState === 1) return 'MUTED';
        if (this.speechState === 2) return 'ACTIVE';
        if (this.speechState === 3) return 'OFF';
        return 'ACTIVE';
    }
    public getFastestLap(): string {
        if (null == this.fastLap) return '-';
        else return this.fastLap.toString();
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
        return records;
    }
    private updateBestTime(event: DSTransmissionRecord): void {
        let time = this.extractTime(event);
        if (time < this.bestTime) {
            this.bestTime = time;
            if (event.laneNumber == this.laneData.lane) {
                this.laneIsBestTime = true;
                this.fastLap = this.laneData.lapCount;
            } else this.laneIsBestTime = false;
        }
    }
    private extractTime(event: DSTransmissionRecord): number {
        return event.timingData.seconds + event.timingData.fraction / 10000;
    }
}
