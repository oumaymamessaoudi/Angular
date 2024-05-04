import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverNadhirComponent } from './driver-nadhir.component';

describe('DriverNadhirComponent', () => {
  let component: DriverNadhirComponent;
  let fixture: ComponentFixture<DriverNadhirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverNadhirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverNadhirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
