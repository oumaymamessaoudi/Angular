import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRelativeComponent } from './list-relative.component';

describe('ListRelativeComponent', () => {
  let component: ListRelativeComponent;
  let fixture: ComponentFixture<ListRelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRelativeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
