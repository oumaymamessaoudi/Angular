import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminarchivelistComponent } from './adminarchivelist.component';

describe('AdminarchivelistComponent', () => {
  let component: AdminarchivelistComponent;
  let fixture: ComponentFixture<AdminarchivelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminarchivelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminarchivelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
