import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRelative1Component } from './home-relative1.component';

describe('HomeRelative1Component', () => {
  let component: HomeRelative1Component;
  let fixture: ComponentFixture<HomeRelative1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeRelative1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRelative1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
