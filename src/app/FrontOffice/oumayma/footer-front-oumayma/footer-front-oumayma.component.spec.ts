import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterFrontOumaymaComponent } from './footer-front-oumayma.component';

describe('FooterFrontOumaymaComponent', () => {
  let component: FooterFrontOumaymaComponent;
  let fixture: ComponentFixture<FooterFrontOumaymaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterFrontOumaymaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterFrontOumaymaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
