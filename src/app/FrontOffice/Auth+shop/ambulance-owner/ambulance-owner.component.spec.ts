import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceOwnerComponent } from './ambulance-owner.component';

describe('AmbulanceOwnerComponent', () => {
  let component: AmbulanceOwnerComponent;
  let fixture: ComponentFixture<AmbulanceOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbulanceOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbulanceOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
