import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilenurseComponent } from './profilenurse.component';

describe('ProfilenurseComponent', () => {
  let component: ProfilenurseComponent;
  let fixture: ComponentFixture<ProfilenurseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilenurseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilenurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
