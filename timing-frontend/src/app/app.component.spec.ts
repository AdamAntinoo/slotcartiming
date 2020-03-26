// - CORE
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
// - TESTING
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
// - PROVIDERS
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LaneTimingData } from './domain/LaneTimingData.domain';

describe('PAGE AppComponent [Module: APP]', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                AppComponent,
            ],
            providers: [
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    // - C O N S T R U C T I O N   P H A S E
    describe('Construction Phase', () => {
        it('Should be created', () => {
            console.log('><[app/AppComponent]> should be created');
            expect(component).toBeDefined('component has not been created.');
        });
    });

    // - C O D E   C O V E R A G E   P H A S E
    describe('Code Coverage Phase [getters]', () => {
        it('getTimings: get the list of lane data', () => {
            component.ngOnInit();
            const timings: LaneTimingData[] = component.getTimings();
            expect(timings.length).toBe(environment.laneCount);
        });
    });

    // - L I F E C Y C L E   P H A S E
    describe('Lifecycle Phase', () => {
        it('Lifecycle: OnInit: check the initialization is called once', fakeAsync(() => {
            console.log('><[app/AppComponent]> Lifecycle: check the initialization is called once');
            spyOn(component, 'ngOnInit');
            component.ngOnInit();
            expect(component.ngOnInit).toHaveBeenCalledTimes(1);
        }));
        it('Lifecycle: OnInit: initialize the list of lane data', fakeAsync(() => {
            console.log('><[app/AppComponent]> Lifecycle: OnInit: initialize the list of lane data');
            let timings: LaneTimingData[] = component.getTimings();
            expect(timings.length).toBe(0, 'Expect the array not have been initialized');
            component.ngOnInit();
            timings = component.getTimings();
            expect(timings.length).toBe(environment.laneCount, 'Expect the configured number of lanes');
        }));
    });
});
