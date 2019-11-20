import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAncillaryServicesComponent } from './modify-ancillary-services.component';

describe('ModifyAncillaryServicesComponent', () => {
  let component: ModifyAncillaryServicesComponent;
  let fixture: ComponentFixture<ModifyAncillaryServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyAncillaryServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAncillaryServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
