import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterTemplateNadhirComponent } from './footer-template-nadhir.component';

describe('FooterTemplateNadhirComponent', () => {
  let component: FooterTemplateNadhirComponent;
  let fixture: ComponentFixture<FooterTemplateNadhirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterTemplateNadhirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterTemplateNadhirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
