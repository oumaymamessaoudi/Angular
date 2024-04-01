import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceDriverComponent } from './ambulance-driver.component';

describe('AmbulanceDriverComponent', () => {
  let component: AmbulanceDriverComponent;
  let fixture: ComponentFixture<AmbulanceDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbulanceDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbulanceDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
