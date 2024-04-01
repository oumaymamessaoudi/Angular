import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateNadhirComponent } from './all-template-nadhir.component';

describe('AllTemplateNadhirComponent', () => {
  let component: AllTemplateNadhirComponent;
  let fixture: ComponentFixture<AllTemplateNadhirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTemplateNadhirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTemplateNadhirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
