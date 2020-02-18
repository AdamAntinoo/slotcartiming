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

@Component({
    selector: 'app-lane-timing-panel',
    templateUrl: './lane-timing-panel.component.html',
    styleUrls: ['./lane-timing-panel.component.scss'],
    providers: [SpeechSynthesisUtteranceFactoryService]
})
export class LaneTimingPanelComponent {
    @Input() laneData: LaneTimingData;
    public speechActive: boolean = true;
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
                if (event.laneNumber == this.laneData.lane) {
                    let message: string = this.laneData.processEvent(event);
                    if (this.speechActive) this.speechService.speak(this.speechFactory.text(message));
                }
            });
    }
    public isPanelClean(): boolean {
        return this.laneData.clean;
    }
}
