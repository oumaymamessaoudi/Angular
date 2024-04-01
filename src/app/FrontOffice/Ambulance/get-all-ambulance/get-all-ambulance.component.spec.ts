import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllAmbulanceComponent } from './get-all-ambulance.component';

describe('GetAllAmbulanceComponent', () => {
  let component: GetAllAmbulanceComponent;
  let fixture: ComponentFixture<GetAllAmbulanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllAmbulanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllAmbulanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
