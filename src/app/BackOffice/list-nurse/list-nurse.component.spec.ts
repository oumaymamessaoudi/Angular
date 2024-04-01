import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNurseComponent } from './list-nurse.component';

describe('ListNurseComponent', () => {
  let component: ListNurseComponent;
  let fixture: ComponentFixture<ListNurseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNurseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
