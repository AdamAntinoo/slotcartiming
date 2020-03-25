export class DSTimingRecord {
    public hours: number = 0;
    public minutes: number = 0;
    public seconds: number = 0;
    public fraction: number = 0.0; // Four decimals second fraction

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
