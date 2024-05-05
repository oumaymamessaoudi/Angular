import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoughtProductsComponent } from './bought-products.component';

describe('BoughtProductsComponent', () => {
  let component: BoughtProductsComponent;
  let fixture: ComponentFixture<BoughtProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoughtProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoughtProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
