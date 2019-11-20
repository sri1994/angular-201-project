import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInflightShoppingRequestComponent } from './add-inflight-shopping-request.component';

describe('AddInflightShoppingRequestComponent', () => {
  let component: AddInflightShoppingRequestComponent;
  let fixture: ComponentFixture<AddInflightShoppingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInflightShoppingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInflightShoppingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
