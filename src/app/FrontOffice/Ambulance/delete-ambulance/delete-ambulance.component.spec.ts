import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAmbulanceComponent } from './delete-ambulance.component';

describe('DeleteAmbulanceComponent', () => {
  let component: DeleteAmbulanceComponent;
  let fixture: ComponentFixture<DeleteAmbulanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAmbulanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAmbulanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
