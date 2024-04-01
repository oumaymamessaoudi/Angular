import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltempbackComponent } from './alltempback.component';

describe('AlltempbackComponent', () => {
  let component: AlltempbackComponent;
  let fixture: ComponentFixture<AlltempbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlltempbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlltempbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
