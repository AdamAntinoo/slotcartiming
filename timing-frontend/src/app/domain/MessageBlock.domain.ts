// - CORE
import { formatNumber } from '@angular/common';
import { MessageTypes } from './interfaces/MessageTypes.enum';

export class MessageBlock {
    public messageType: MessageTypes = MessageTypes.FAST_LAP;
    public message: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}