import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SHOWMOREComponent } from './SHOWMOREComponent';

describe('SHOWMOREComponent', () => {
  let component: SHOWMOREComponent;
  let fixture: ComponentFixture<SHOWMOREComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SHOWMOREComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SHOWMOREComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
