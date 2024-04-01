import { TestBed } from '@angular/core/testing';

import { ElderlyService } from './elderly.service';

describe('ElderlyService', () => {
  let service: ElderlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElderlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
