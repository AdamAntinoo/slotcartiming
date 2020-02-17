import { TestBed } from '@angular/core/testing';

import { DSPusherService } from './dspusher.service';

describe('DSPusherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DSPusherService = TestBed.get(DSPusherService);
    expect(service).toBeTruthy();
  });
});
