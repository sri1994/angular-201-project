import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineToolbarComponent } from './airline-toolbar.component';

describe('AirlineToolbarComponent', () => {
  let component: AirlineToolbarComponent;
  let fixture: ComponentFixture<AirlineToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
