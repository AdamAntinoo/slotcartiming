import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { LaneTimingData } from './domain/LaneTimingData.domain';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'timing-frontend';
    public timings: LaneTimingData[] = [];

    constructor() {
    }
    ngOnInit() {
        for (let i = 1; i < 9; i++) {
            this.timings.push(new LaneTimingData().setLaneNumber(i));
        }
    }
    public getTimings(): any {
        return this.timings;
    }
}
