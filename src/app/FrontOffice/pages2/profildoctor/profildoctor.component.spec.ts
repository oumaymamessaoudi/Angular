import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfildoctorComponent } from './profildoctor.component';

describe('ProfildoctorComponent', () => {
  let component: ProfildoctorComponent;
  let fixture: ComponentFixture<ProfildoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfildoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfildoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
