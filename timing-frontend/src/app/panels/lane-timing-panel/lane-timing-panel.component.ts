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

const DISPLAY_RECORDS_NUMBER = 23;

@Component({
    selector: 'app-lane-timing-panel',
    templateUrl: './lane-timing-panel.component.html',
    styleUrls: ['./lane-timing-panel.component.scss'],
    providers: [SpeechSynthesisUtteranceFactoryService]
})
export class LaneTimingPanelComponent {
    @Input() laneData: LaneTimingData;
    public speechActive: boolean = false;
    public laneIsBestTime: boolean = false;
    private bestTime: number = 999.0;
    private eventSource: Subscription;

    constructor(
        protected dsDatService: DSPusherService,
        protected speechFactory: SpeechSynthesisUtteranceFactoryService,
        protected speechService: SpeechSynthesisService) {
        this.eventSource = this.dsDatService.accessEventSource()
            .subscribe((event: DSTransmissionRecord) => {
                // Process only events for this lane.
                console.log('-[LaneTimingPanelComponent]> event: ' + JSON.stringify(event));
                console.log('-[LaneTimingPanelComponent]> target lane: ' + event.laneNumber);
                this.updateBestTime(event);
                if (event.laneNumber == this.laneData.lane) {
                    let message: string = this.laneData.processEvent(event);
                    if (this.speechActive) this.speechService.speak(this.speechFactory.text(message));
                }
            });
    }
    public isPanelClean(): boolean {
        return this.laneData.clean;
    }
    public reset(): void {
        this.laneData.cleanData();
        this.speechActive = false;
    }
    public toggleSpeech(): void {
        this.speechActive = !this.speechActive;
    }
    public getTimeRecords(): LapTimeRecord[] {
        let size = this.laneData.lapTimeRecords.length;
        if (size > DISPLAY_RECORDS_NUMBER) {
            let start = size - DISPLAY_RECORDS_NUMBER;
            let end = start + DISPLAY_RECORDS_NUMBER;
            return this.laneData.lapTimeRecords.slice(start, end);
        } else return this.laneData.lapTimeRecords;
    }
    private updateBestTime(event: DSTransmissionRecord): void {
        let time = this.extractTime(event);
        if (time < this.bestTime) {
            this.bestTime = time;
            if (event.laneNumber == this.laneData.lane) this.laneIsBestTime = true;
            else this.laneIsBestTime = false;
        }
    }
    private extractTime(event: DSTransmissionRecord): number {
        return event.timingData.seconds + event.timingData.fraction / 10000;
    }
}
