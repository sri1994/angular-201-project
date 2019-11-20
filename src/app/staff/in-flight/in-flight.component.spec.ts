import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InFlightComponent } from './in-flight.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import * as FlightReducer from './../../store/reducers/flights.reducers';

describe('InFlightComponent', () => {
  let component: InFlightComponent;
  let fixture: ComponentFixture<InFlightComponent>;

  // let mockStore: MockStore<FlightReducer.flightsState>;
  // const tempState: any = {
  //   list: [],
  //   flightsListLoading: true,
  //   updateFlightsLoading: true,
  //   flightsListError: undefined,
  //   updateFlightsError: undefined,
  //   type: undefined
  // };
  // let mockUsernameSelector: MemoizedSelector<FlightReducer.flightsState, object>

  const storeStub = {
    select: arg1 => ({
      subscribe: success => {
        const res = [{
          list: []
        }];
        success(res);
      }
    }),
    dispatch: arg1 => { }
  };
  const queryParams = {
    id: 1,
    category: 'nowPlaying',
    customerMasterId: ''
  };
  const activatedRouteStub = {
    params: {
      subscribe: res => {
        res(queryParams);
      }
    }
  };

  const httpClientStub = {
    get: arg1 => ({
      subscribe: success => {
        const obj = {
          firstname: 'John',
          lastname: 'Doe',
          age: 50,
          eyecolor: 'blue',
          theaters: ['Hello']
        };
        const error = {
          message: 'Error'
        };
        success(obj);
        // err(error);
      }
    }),
    put: arg1 => ({
      subscribe: success => {
        const obj = [
          {
            theaters: {}
          }
        ];
        success(obj);
        return {};
      }
    }),
    post: (arg1, arg2) => ({ pipe: () => ({ pipe: () => ({}) }) })
  };

  const matDialogStub = {
    open: (dialogComponentName1, object2) => ({
      afterClosed: () => ({
        subscribe: success => {
          const res = [];
          success(res);
        }
      })
    }),
    closeAll: () => ({
      afterClosed: () => {
        return { subscribe: result => result([]) };
      }
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InFlightComponent],
      providers: [
        // provideMockStore(),
        {
          provide: Store,
          useValue: storeStub
        },
        {
          provide: MatDialog,
          useValue: matDialogStub
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can call openDialog method', () => {
    expect(component.openDialog).toBeDefined();
    spyOn(component, 'openDialog').and.callThrough();
    component.openDialog('add-ancillary-services', {});
    expect(component.openDialog).toHaveBeenCalled();
  });

  it('can call onFlightSelectionChanged method', () => {
    expect(component.onFlightSelectionChanged).toBeDefined();
    spyOn(component, 'onFlightSelectionChanged').and.callThrough();
    const param: any = {
      value: {
        id: '1'
      }
    };
    component.onFlightSelectionChanged(param);
    expect(component.onFlightSelectionChanged).toHaveBeenCalled();
  });

  it('can call updateCheckedInPayload method', () => {
    expect(component.updateCheckedInPayload).toBeDefined();
    spyOn(component, 'updateCheckedInPayload').and.callThrough();
    const param1: any = {
      seatList: [{
      }],
      flightId: 'f1'
    };
    const param2: any = 'add-ancillary-services';
    component.updatedFlightsList = [{ id: 'f1', name: 'bulbul' }];
    component.updateCheckedInPayload(param1, param2);
    expect(component.updateCheckedInPayload).toHaveBeenCalled();
  });

  it('can call showFlights method', () => {
    expect(component.showFlights).toBeDefined();
    spyOn(component, 'showFlights').and.callThrough();
    let actionType = 'specialMeal';
    component.showFlights(actionType);
    actionType = 'ancillaryServices';
    component.showFlights(actionType);
    actionType = 'inFlightShoppingRequest';
    component.showFlights(actionType);
    expect(component.showFlights).toHaveBeenCalled();
  });

});
