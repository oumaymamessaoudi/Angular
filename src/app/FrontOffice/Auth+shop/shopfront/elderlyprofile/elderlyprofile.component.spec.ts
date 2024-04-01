import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElderlyprofileComponent } from './elderlyprofile.component';

describe('ElderlyprofileComponent', () => {
  let component: ElderlyprofileComponent;
  let fixture: ComponentFixture<ElderlyprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElderlyprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElderlyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
