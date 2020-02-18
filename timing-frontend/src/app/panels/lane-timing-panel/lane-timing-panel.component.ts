// - CORE
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Subscription } from 'rxjs';
// - SERVICES
import { DSPusherService } from 'src/app/services/dspusher.service';
// - DOMAIN
import { LaneTimingData } from 'src/app/domain/LaneTimingData.domain';
import { DSTransmissionRecord } from 'src/app/domain/dto/DSTransmissionRecord.dto';

@Component({
    selector: 'app-lane-timing-panel',
    templateUrl: './lane-timing-panel.component.html',
    styleUrls: ['./lane-timing-panel.component.scss']
})
export class LaneTimingPanelComponent {
    @Input() laneData: LaneTimingData;
    private eventSource: Subscription;

    constructor(protected dsDatService: DSPusherService) {
        this.eventSource = this.dsDatService.accessEventSource()
            .subscribe((event: DSTransmissionRecord) => {
                // Process only events for this lane.
                console.log('-[LaneTimingPanelComponent]> event: ' + JSON.stringify(event));
                console.log('-[LaneTimingPanelComponent]> target lane: ' + event.laneNumber);
                if (event.laneNumber == this.laneData.lane) {
                    this.laneData.processEvent(event);
                }
            });
    }
}
