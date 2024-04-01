import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTemplateNadhirComponent } from './home-template-nadhir.component';

describe('HomeTemplateNadhirComponent', () => {
  let component: HomeTemplateNadhirComponent;
  let fixture: ComponentFixture<HomeTemplateNadhirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeTemplateNadhirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTemplateNadhirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
