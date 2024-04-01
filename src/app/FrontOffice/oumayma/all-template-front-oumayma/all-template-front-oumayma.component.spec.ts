import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateFrontOumaymaComponent } from './all-template-front-oumayma.component';

describe('AllTemplateFrontOumaymaComponent', () => {
  let component: AllTemplateFrontOumaymaComponent;
  let fixture: ComponentFixture<AllTemplateFrontOumaymaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTemplateFrontOumaymaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTemplateFrontOumaymaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
