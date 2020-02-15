import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaneTimingPanelComponent } from './lane-timing-panel.component';

describe('LaneTimingPanelComponent', () => {
  let component: LaneTimingPanelComponent;
  let fixture: ComponentFixture<LaneTimingPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaneTimingPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaneTimingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
