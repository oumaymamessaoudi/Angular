import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeshopComponent } from './homeshop.component';

describe('HomeshopComponent', () => {
  let component: HomeshopComponent;
  let fixture: ComponentFixture<HomeshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
