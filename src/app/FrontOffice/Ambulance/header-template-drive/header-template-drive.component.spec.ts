import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTemplateDriveComponent } from './header-template-drive.component';

describe('HeaderTemplateDriveComponent', () => {
  let component: HeaderTemplateDriveComponent;
  let fixture: ComponentFixture<HeaderTemplateDriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderTemplateDriveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTemplateDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
