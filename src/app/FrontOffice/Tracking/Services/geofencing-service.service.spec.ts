import { TestBed } from '@angular/core/testing';

import { GeofencingServiceService } from './geofencing-service.service';

describe('GeofencingServiceService', () => {
  let service: GeofencingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeofencingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
