import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateDriveComponent } from './all-template-drive.component';

describe('AllTemplateDriveComponent', () => {
  let component: AllTemplateDriveComponent;
  let fixture: ComponentFixture<AllTemplateDriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTemplateDriveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTemplateDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
