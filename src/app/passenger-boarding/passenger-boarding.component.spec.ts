import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerBoardingComponent } from './passenger-boarding.component';

describe('PassengerBoardingComponent', () => {
  let component: PassengerBoardingComponent;
  let fixture: ComponentFixture<PassengerBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassengerBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
