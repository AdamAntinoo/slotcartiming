// - CORE
import { NO_ERRORS_SCHEMA } from '@angular/core';
// - TESTING
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
// - PROVIDERS
import { LaneTimingPanelComponent } from './lane-timing-panel.component';
import { LaneTimingData } from 'src/app/domain/LaneTimingData.domain';

xdescribe('PANEL LaneTimingPanelComponent [Module: PANELS]', () => {
  let fixture: ComponentFixture<LaneTimingPanelComponent>;
  let component: LaneTimingPanelComponent;
  // let isolationService: SupportIsolationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        LaneTimingPanelComponent,
      ],
      // providers: [
      //     { provide: IsolationService, useClass: SupportIsolationService },
      // ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LaneTimingPanelComponent);
    component = fixture.componentInstance;
    // isolationService = TestBed.get(IsolationService);
  });

  // - C O N S T R U C T I O N   P H A S E
  describe('Construction Phase', () => {
    it('Should be created', () => {
      console.log('><[panels/LaneTimingPanelComponent]> should be created');
      expect(component).toBeDefined('component has not been created.');
    });
  });

  // - C O D E   C O V E R A G E   P H A S E
  describe('Code Coverage Phase [getters]', () => {
    it('isPanelClean: validate if the panel is clear and not used field', () => {
      component.laneData = new LaneTimingData();
      const obtained = component.isPanelClean();
      const expected = true;
      expect(obtained).toBe(expected);
    });
    it('speechMode: validate the sound mode selected field', () => {
      const obtained = component.speechMode();
      expect(obtained).toBe('ACTIVE');
    });
  });
});
