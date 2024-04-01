import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAmbulanceDriverComponent } from './list-ambulance-driver.component';

describe('ListAmbulanceDriverComponent', () => {
  let component: ListAmbulanceDriverComponent;
  let fixture: ComponentFixture<ListAmbulanceDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAmbulanceDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAmbulanceDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
