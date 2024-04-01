import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAmbulanceOwnerComponent } from './list-ambulance-owner.component';

describe('ListAmbulanceOwnerComponent', () => {
  let component: ListAmbulanceOwnerComponent;
  let fixture: ComponentFixture<ListAmbulanceOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAmbulanceOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAmbulanceOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
