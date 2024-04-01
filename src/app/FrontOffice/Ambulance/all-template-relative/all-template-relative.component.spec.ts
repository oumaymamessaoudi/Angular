import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateRelativeComponent } from './all-template-relative.component';

describe('AllTemplateRelativeComponent', () => {
  let component: AllTemplateRelativeComponent;
  let fixture: ComponentFixture<AllTemplateRelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTemplateRelativeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTemplateRelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
