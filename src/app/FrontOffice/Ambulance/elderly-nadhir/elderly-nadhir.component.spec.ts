import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElderlyNadhirComponent } from './elderly-nadhir.component';

describe('ElderlyNadhirComponent', () => {
  let component: ElderlyNadhirComponent;
  let fixture: ComponentFixture<ElderlyNadhirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElderlyNadhirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElderlyNadhirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
