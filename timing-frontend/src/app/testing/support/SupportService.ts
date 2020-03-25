// - CORE
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SupportService {
    // - R A M D O M
    public generateRandomNum(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    public generateRandomReal(min: number, max: number, decimals: number) {
        let entirePart = Math.floor(Math.random() * (max - min + 1)) + min;
        let fractionalPart = (Math.floor(Math.random() * (Math.pow(10, decimals) - 1 + 1)) + min) / Math.pow(10, decimals);
        return entirePart + fractionalPart;
    };
    public generateRandomString(length: number): string {
        var string = '';
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' //Include numbers if you want
        for (let i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    }
}