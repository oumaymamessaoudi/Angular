import { TestBed } from '@angular/core/testing';

import { RoleStatisticsService } from './role-statistics.service';

describe('RoleStatisticsService', () => {
  let service: RoleStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
