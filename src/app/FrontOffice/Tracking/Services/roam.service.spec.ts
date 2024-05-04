import { TestBed } from '@angular/core/testing';

import { RoamService } from './roam.service';

describe('RoamService', () => {
  let service: RoamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
