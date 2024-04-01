import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductlistclientComponent } from './productlistclient.component';

describe('ProductlistclientComponent', () => {
  let component: ProductlistclientComponent;
  let fixture: ComponentFixture<ProductlistclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductlistclientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductlistclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
