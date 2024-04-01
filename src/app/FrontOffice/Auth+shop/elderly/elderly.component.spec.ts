import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElderlyComponent } from './elderly.component';

describe('ElderlyComponent', () => {
  let component: ElderlyComponent;
  let fixture: ComponentFixture<ElderlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElderlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElderlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
