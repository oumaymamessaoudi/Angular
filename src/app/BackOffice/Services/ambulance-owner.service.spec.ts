import { TestBed } from '@angular/core/testing';

import { AmbulanceOwnerService } from './ambulance-owner.service';

describe('AmbulanceOwnerService', () => {
  let service: AmbulanceOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbulanceOwnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
