import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrDeleteAncillaryServiceComponent } from './add-or-delete-ancillary-service.component';

describe('AddOrDeleteAncillaryServiceComponent', () => {
  let component: AddOrDeleteAncillaryServiceComponent;
  let fixture: ComponentFixture<AddOrDeleteAncillaryServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrDeleteAncillaryServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrDeleteAncillaryServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
