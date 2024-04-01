import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavshopbackComponent } from './navshopback.component';

describe('NavshopbackComponent', () => {
  let component: NavshopbackComponent;
  let fixture: ComponentFixture<NavshopbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavshopbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavshopbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
