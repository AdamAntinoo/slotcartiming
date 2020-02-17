// - CORE
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { LapTimeRecord } from 'src/app/domain/LapTimeRecord.domain';
import { DSPusherService } from 'src/app/services/dspusher.service';
import { LaneTimingData } from 'src/app/domain/LaneTimingData.domain';
import { Subject, Subscription } from 'rxjs';
import { DSTransmissionRecord } from 'src/app/domain/dto/DSTransmissionRecord.dto';
import { escapeIdentifier } from '@angular/compiler/src/output/abstract_emitter';

@Component({
    selector: 'app-lane-timing-panel',
    templateUrl: './lane-timing-panel.component.html',
    styleUrls: ['./lane-timing-panel.component.scss']
})
export class LaneTimingPanelComponent /*implements OnInit*/ {
    @Input() laneData: LaneTimingData;
    private eventSource: Subscription;
    // public lapCount: number = 7;
    // public lapTimeRecords: LapTimeRecord[] = [];
    // public bestTime: LapTimeRecord;
    // public averageTime: number;

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
        // this.averageTime = 16.872;
        // this.bestTime = new LapTimeRecord({ lap: 6, time: 16.432 });
    }

    // ngOnInit() {
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 6, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 6, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 6, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 8, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 10, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 12, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 14, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 16, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 18, time: 16.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 5, time: 17.432 }));
    //     this.lapTimeRecords.push(new LapTimeRecord({ lap: 20, time: 16.432 }));
    // }

}
