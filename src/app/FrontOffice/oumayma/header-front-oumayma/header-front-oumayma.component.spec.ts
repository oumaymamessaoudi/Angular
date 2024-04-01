import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFrontOumaymaComponent } from './header-front-oumayma.component';

describe('HeaderFrontOumaymaComponent', () => {
  let component: HeaderFrontOumaymaComponent;
  let fixture: ComponentFixture<HeaderFrontOumaymaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderFrontOumaymaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderFrontOumaymaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
