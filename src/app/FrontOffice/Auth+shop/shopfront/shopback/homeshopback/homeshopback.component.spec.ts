import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeshopbackComponent } from './homeshopback.component';

describe('HomeshopbackComponent', () => {
  let component: HomeshopbackComponent;
  let fixture: ComponentFixture<HomeshopbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeshopbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeshopbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
