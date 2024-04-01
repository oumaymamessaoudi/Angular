import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilerelativeComponent } from './profilerelative.component';

describe('ProfilerelativeComponent', () => {
  let component: ProfilerelativeComponent;
  let fixture: ComponentFixture<ProfilerelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilerelativeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilerelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
