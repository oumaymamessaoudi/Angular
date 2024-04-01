import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElderlyDashboardComponent } from './elderly-dashboard.component';

describe('ElderlyDashboardComponent', () => {
  let component: ElderlyDashboardComponent;
  let fixture: ComponentFixture<ElderlyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElderlyDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElderlyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
