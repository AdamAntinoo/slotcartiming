// - TESTING
import { TestBed } from '@angular/core/testing';
// - PROVIDERS
import { SupportService } from '../testing/support/SupportService';
// - DOMAIN
import { LaneTimingData } from './LaneTimingData.domain';
import { DSTransmissionRecord } from './dto/DSTransmissionRecord.dto';

fdescribe('CLASS LaneTimingData [Module: DOMAIN]', () => {
    const INCIDENCE_LAP_TIME_LIMIT = 40.0;
    const MAX_LAP_TIME = 999.0;
    let isolation: SupportService;

    beforeEach(() => {
        isolation = TestBed.get(SupportService);
    });
    // - C O N S T R U C T I O N   P H A S E
    describe('Construction Phase', () => {
        it('Should be created', () => {
            console.log('><[domain/LaneTimingData]> should be created');
            expect(new LaneTimingData()).toBeTruthy();
        });
    });
    // - C O D E   C O V E R A G E   P H A S E
    describe('Code Coverage Phase [getters]', () => {
        it('getBestTime.success: check the bestTime field', () => {
            const timingData = new LaneTimingData();
            expect(timingData.getBestTime()).toBe('-.-');
            // Processing some data
            let event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 15, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.getBestTime()).toBe('15.830');
        });
        it('getBestSplitTime.success: check the best split time field', () => {
            const timingData = new LaneTimingData();
            expect(timingData.getBestSplitTime()).toBe('-.-');
            // Processing some data
            let event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 15, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.getBestSplitTime()).toBe('15.830');
        });
        it('getAverageTime.success: check the average time field', () => {
            const timingData = new LaneTimingData();
            expect(timingData.getAverageTime()).toBe('-.-');
            // Processing some data
            let event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 15, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.getAverageTime()).toBe('15.830');
        });
        it('getAverageChange: check the average change sign field', () => {
            const timingData = new LaneTimingData();
            expect(timingData.getAverageChange()).toBe('-EQUAL-');
            // Processing some data
            let event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 15, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.getAverageChange()).toBe('-EQUAL-');
            event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 10, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.getAverageChange()).toBe('-BETTER-');
            event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 30, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.getAverageChange()).toBe('-WORST-');
        });
    });
    describe('Code Coverage Phase [setters]', () => {
        it('setLaneNumber.success: check the lane number change field', () => {
            const timingData = new LaneTimingData();
            expect(timingData.lane).toBe(0);
            timingData.setLaneNumber(4);
            expect(timingData.lane).toBe(4);
        });
    });
    describe('Code Coverage Phase [cleanData]', () => {
        it('cleanData.success: check the clearing of the lane data fields', () => {
            const timingData = new LaneTimingData();
            // Processing some data
            let event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 15, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.getAverageTime()).toBe('15.830');
            timingData.cleanData();
            expect(timingData.getAverageTime()).toBe('-.-');
        });
    });
    describe('Code Coverage Phase [detectIncidence]', () => {
        it('detectIncidence.success: check the update for the session data after a failed lap', () => {
            const timingData = new LaneTimingData();
            // Processing some data
            let event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 15, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.lapCount).toBe(1);
            expect(timingData.getBestSplitTime()).toBe('15.830');
            event = new DSTransmissionRecord({
                "transmissionSequence": 2061,
                "dsModel": "DS-300",
                "typeOfDSRecord": "TIMING",
                "laneNumber": 3,
                "numberOfLaps": 11,
                "timingData": { "hours": 0, "minutes": 0, "seconds": 50.0, "fraction": 8300 }
            });
            timingData.processEvent(event);
            expect(timingData.lapSplitCount).toBe(0);
            expect(timingData.getBestSplitTime()).toBe('-.-');
        });
    });
});
