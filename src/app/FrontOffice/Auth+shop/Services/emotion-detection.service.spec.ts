import { TestBed } from '@angular/core/testing';

import { EmotionDetectionService } from './emotion-detection.service';

describe('EmotionDetectionService', () => {
  let service: EmotionDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmotionDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
