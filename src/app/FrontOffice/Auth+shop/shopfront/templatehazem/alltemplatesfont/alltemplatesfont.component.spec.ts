import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltemplatesfontComponent } from './alltemplatesfontshop.component';

describe('AlltemplatesfontComponent', () => {
  let component: AlltemplatesfontComponent;
  let fixture: ComponentFixture<AlltemplatesfontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlltemplatesfontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlltemplatesfontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
