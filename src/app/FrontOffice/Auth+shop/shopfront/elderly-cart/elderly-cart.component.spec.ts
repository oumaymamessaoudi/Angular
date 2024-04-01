import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElderlyCartComponent } from './elderly-cart.component';

describe('ElderlyCartComponent', () => {
  let component: ElderlyCartComponent;
  let fixture: ComponentFixture<ElderlyCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElderlyCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElderlyCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
