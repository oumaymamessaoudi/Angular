import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeteventsComponent } from './getevents.component';

describe('GeteventsComponent', () => {
  let component: GeteventsComponent;
  let fixture: ComponentFixture<GeteventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeteventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeteventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
