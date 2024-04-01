import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAmbulanceComponent } from './update-ambulance.component';

describe('UpdateAmbulanceComponent', () => {
  let component: UpdateAmbulanceComponent;
  let fixture: ComponentFixture<UpdateAmbulanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAmbulanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAmbulanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
