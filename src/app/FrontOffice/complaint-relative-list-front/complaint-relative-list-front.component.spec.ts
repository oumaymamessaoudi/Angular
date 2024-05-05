import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintRelativeListFrontComponent } from './complaint-relative-list-front.component';

describe('ComplaintRelativeListFrontComponent', () => {
  let component: ComplaintRelativeListFrontComponent;
  let fixture: ComponentFixture<ComplaintRelativeListFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintRelativeListFrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintRelativeListFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
