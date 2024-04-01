import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListElderlyComponent } from './list-elderly.component';

describe('ListElderlyComponent', () => {
  let component: ListElderlyComponent;
  let fixture: ComponentFixture<ListElderlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListElderlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListElderlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
