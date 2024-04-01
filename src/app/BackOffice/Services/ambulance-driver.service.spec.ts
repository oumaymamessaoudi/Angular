import { TestBed } from '@angular/core/testing';

import { AmbulanceDriverService } from './ambulance-driver.service';

describe('AmbulanceDriverService', () => {
  let service: AmbulanceDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbulanceDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
