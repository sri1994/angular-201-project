import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySpecialMealComponent } from './modify-special-meal.component';

describe('ModifySpecialMealComponent', () => {
  let component: ModifySpecialMealComponent;
  let fixture: ComponentFixture<ModifySpecialMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifySpecialMealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifySpecialMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
