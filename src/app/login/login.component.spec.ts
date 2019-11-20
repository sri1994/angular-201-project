import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { SharedModule } from './../shared/shared.module';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const storeStub = {
    dispatch: arg1 => ({
          subscribe: success => {
            const res = [];
            success(res);
          }
        }),
       };

  const routerStub = {};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports : [SharedModule],
      providers: [{
        provide: Store, useValue: storeStub,

      },
      {
        provide: Router, useValue: routerStub

      }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
