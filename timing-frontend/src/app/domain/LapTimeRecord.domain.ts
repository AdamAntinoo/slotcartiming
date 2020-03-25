// - CORE
import { formatNumber } from '@angular/common';
// - DOMAIN
import { global } from './SlotTimingConstants.const';

export class LapTimeRecord {
    public lap: number = 0;
    public time: number = global.MAX_LAP_TIME;
    public bestTime: boolean = false;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    // - G E T T E R S   &   S E T T E R S
    public getTime(): string {
        if (this.time == 0.0) return '-.-';
        if (this.time == global.MAX_LAP_TIME) return '-.-';
        else return formatNumber(this.time, 'en-US', '2.3-4');
    }
}
