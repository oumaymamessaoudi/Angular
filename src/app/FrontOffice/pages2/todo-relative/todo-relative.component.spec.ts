import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoRelativeComponent } from './todo-relative.component';

describe('TodoRelativeComponent', () => {
  let component: TodoRelativeComponent;
  let fixture: ComponentFixture<TodoRelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoRelativeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoRelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
