import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheAmbulanceComponent } from './affiche-ambulance.component';

describe('AfficheAmbulanceComponent', () => {
  let component: AfficheAmbulanceComponent;
  let fixture: ComponentFixture<AfficheAmbulanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheAmbulanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheAmbulanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
