import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledriverComponent } from './profiledriver.component';

describe('ProfiledriverComponent', () => {
  let component: ProfiledriverComponent;
  let fixture: ComponentFixture<ProfiledriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfiledriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfiledriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
