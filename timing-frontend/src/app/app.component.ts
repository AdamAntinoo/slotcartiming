import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { LaneTimingData } from './domain/LaneTimingData.domain';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private timings: LaneTimingData[] = [];
    /**
     * Initialize the list of lanes. This loop depends on the configuration to set the number of lanes.
     */
    ngOnInit() {
        for (let i = 1; i <= environment.laneCount; i++)
            this.timings.push(new LaneTimingData().setLaneNumber(i));
    }
    public getTimings(): any {
        return this.timings;
    }
}
