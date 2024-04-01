import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDoctorComponent } from './calendar-doctor.component';

describe('CalendarDoctorComponent', () => {
  let component: CalendarDoctorComponent;
  let fixture: ComponentFixture<CalendarDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
