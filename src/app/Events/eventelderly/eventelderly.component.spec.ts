import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventelderlyComponent } from './eventelderly.component';

describe('EventelderlyComponent', () => {
  let component: EventelderlyComponent;
  let fixture: ComponentFixture<EventelderlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventelderlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventelderlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
