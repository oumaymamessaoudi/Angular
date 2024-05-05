import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativepaymentComponent } from './relativepayment.component';

describe('RelativepaymentComponent', () => {
  let component: RelativepaymentComponent;
  let fixture: ComponentFixture<RelativepaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelativepaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelativepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
