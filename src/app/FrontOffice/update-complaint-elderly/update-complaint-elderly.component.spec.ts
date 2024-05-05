import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateComplaintElderlyComponent } from './update-complaint-elderly.component';

describe('UpdateComplaintElderlyComponent', () => {
  let component: UpdateComplaintElderlyComponent;
  let fixture: ComponentFixture<UpdateComplaintElderlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateComplaintElderlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateComplaintElderlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
