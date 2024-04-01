import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTemplateNadhirComponent } from './header-template-nadhir.component';

describe('HeaderTemplateNadhirComponent', () => {
  let component: HeaderTemplateNadhirComponent;
  let fixture: ComponentFixture<HeaderTemplateNadhirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderTemplateNadhirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTemplateNadhirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
