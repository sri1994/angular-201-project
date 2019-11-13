import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdatePassengerComponent } from './add-or-update-passenger.component';

describe('AddOrUpdatePassengerComponent', () => {
  let component: AddOrUpdatePassengerComponent;
  let fixture: ComponentFixture<AddOrUpdatePassengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrUpdatePassengerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrUpdatePassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
