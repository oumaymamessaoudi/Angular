import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideshopbackComponent } from './sideshopback.component';

describe('SideshopbackComponent', () => {
  let component: SideshopbackComponent;
  let fixture: ComponentFixture<SideshopbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideshopbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideshopbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
