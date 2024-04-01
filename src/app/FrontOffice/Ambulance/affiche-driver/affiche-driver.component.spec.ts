import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheDriverComponent } from './affiche-driver.component';

describe('AfficheDriverComponent', () => {
  let component: AfficheDriverComponent;
  let fixture: ComponentFixture<AfficheDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
