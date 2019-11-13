import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInflightShoppingConfirmModalComponent } from './add-inflight-shopping-confirm-modal.component';

describe('AddInflightShoppingConfirmModalComponent', () => {
  let component: AddInflightShoppingConfirmModalComponent;
  let fixture: ComponentFixture<AddInflightShoppingConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInflightShoppingConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInflightShoppingConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
