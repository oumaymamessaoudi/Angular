import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorComplaintsComponent } from './doctor-complaints.component';

describe('DoctorComplaintsComponent', () => {
  let component: DoctorComplaintsComponent;
  let fixture: ComponentFixture<DoctorComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorComplaintsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
