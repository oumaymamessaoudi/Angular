import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCompositionComponentComponent } from './email-composition-component.component';

describe('EmailCompositionComponentComponent', () => {
  let component: EmailCompositionComponentComponent;
  let fixture: ComponentFixture<EmailCompositionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailCompositionComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailCompositionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
