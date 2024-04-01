import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFrontOumaymaComponent } from './home-front-oumayma.component';

describe('HomeFrontOumaymaComponent', () => {
  let component: HomeFrontOumaymaComponent;
  let fixture: ComponentFixture<HomeFrontOumaymaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeFrontOumaymaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFrontOumaymaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
