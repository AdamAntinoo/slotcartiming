// - CORE
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
// - DOMAIN
import { LaneTimingData } from './domain/LaneTimingData.domain';
import { SessionTimerComponent } from './panels/session-timer/session-timer.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild(SessionTimerComponent) private sessionTimer: SessionTimerComponent;
    private timings: LaneTimingData[] = [];
    private sessionTimerState: boolean = false;
    /**
     * Initialize the list of lanes. This loop depends on the configuration to set the number of lanes.
     */
    // - L I F E C Y C L E
    public ngOnInit() {
        this.restartAllLanes();
    }
    public getTimings(): LaneTimingData[] {
        return this.timings;
    }
    public getApplication(): AppComponent {
        return this;
    }
    public getSesstionTimerState(): boolean {
        return this.sessionTimerState;
    }
    // - V I E W   I N T E R A C T I O N S
    public restartAllLanes(): void {
        this.timings = [];
        for (let i = 1; i <= environment.laneCount; i++)
            this.timings.push(new LaneTimingData().setLaneNumber(i));
    }
    public activateSessionTimer(duration: number): void {
        this.sessionTimerState = true;
        if (null == duration) this.sessionTimer.activate(environment.defaultTrainingSessionDurationInSeconds * 60);
        else this.sessionTimer.activate(duration);
    }
    public deactivateSessionTimer(): void {
        this.sessionTimer.deactivate();
    }
    public toggleSessionTime():void{
        this.sessionTimerState=!this.sessionTimerState;
    }
}
