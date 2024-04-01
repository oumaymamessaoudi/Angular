import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledownerComponent } from './profiledowner.component';

describe('ProfiledownerComponent', () => {
  let component: ProfiledownerComponent;
  let fixture: ComponentFixture<ProfiledownerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfiledownerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfiledownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
