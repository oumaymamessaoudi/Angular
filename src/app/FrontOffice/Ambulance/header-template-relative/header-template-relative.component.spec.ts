import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTemplateRelativeComponent } from './header-template-relative.component';

describe('HeaderTemplateRelativeComponent', () => {
  let component: HeaderTemplateRelativeComponent;
  let fixture: ComponentFixture<HeaderTemplateRelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderTemplateRelativeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTemplateRelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
