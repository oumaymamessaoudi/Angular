import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterfrontComponent } from './footerfront.component';

describe('FooterfrontComponent', () => {
  let component: FooterfrontComponent;
  let fixture: ComponentFixture<FooterfrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterfrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
