export class LapTimeRecord {
    public lap: number = 0;
    public time: number = 9999.0;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    // - G E T T E R S   &   S E T T E R S
    public getTime(): string {
        if (this.time == 0.0) return '-.-';
        if (this.time == 9999.0) return '-.-';
        else return this.time + '';
    }
}
