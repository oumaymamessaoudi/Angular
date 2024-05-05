import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintRelativeComponent } from './complaint-relative.component';

describe('ComplaintRelativeComponent', () => {
  let component: ComplaintRelativeComponent;
  let fixture: ComponentFixture<ComplaintRelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintRelativeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintRelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
