import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleStatisticsComponent } from './role-statistics.component';

describe('RoleStatisticsComponent', () => {
  let component: RoleStatisticsComponent;
  let fixture: ComponentFixture<RoleStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
