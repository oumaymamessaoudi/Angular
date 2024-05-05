import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveEventsComponent } from './archive-events.component';

describe('ArchiveEventsComponent', () => {
  let component: ArchiveEventsComponent;
  let fixture: ComponentFixture<ArchiveEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
