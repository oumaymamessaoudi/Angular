import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElderlyOrderInfoComponent } from './elderly-order-info.component';

describe('ElderlyOrderInfoComponent', () => {
  let component: ElderlyOrderInfoComponent;
  let fixture: ComponentFixture<ElderlyOrderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElderlyOrderInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElderlyOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
