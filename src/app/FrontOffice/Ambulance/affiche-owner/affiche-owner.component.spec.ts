import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheOwnerComponent } from './affiche-owner.component';

describe('AfficheOwnerComponent', () => {
  let component: AfficheOwnerComponent;
  let fixture: ComponentFixture<AfficheOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
