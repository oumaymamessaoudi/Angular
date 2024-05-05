import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintElderlyComponent } from './complaint-elderly.component';

describe('ComplaintElderlyComponent', () => {
  let component: ComplaintElderlyComponent;
  let fixture: ComponentFixture<ComplaintElderlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintElderlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintElderlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
