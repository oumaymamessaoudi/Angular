import { TestBed } from '@angular/core/testing';

import { ElderlyDashboardService } from './elderly-dashboard.service';

describe('ElderlyDashboardService', () => {
  let service: ElderlyDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElderlyDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
