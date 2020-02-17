export class LapTimeRecord {
    public lap: number = 0;
    public time: number = 0.0;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
