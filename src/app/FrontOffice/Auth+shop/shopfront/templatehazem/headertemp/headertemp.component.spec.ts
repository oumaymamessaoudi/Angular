import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadertempComponent } from './headertemp.component';

describe('HeadertempComponent', () => {
  let component: HeadertempComponent;
  let fixture: ComponentFixture<HeadertempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadertempComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadertempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
