import { Component, OnInit } from '@angular/core';
import * as flights from './../../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './../../store/app.states';
import * as FlightActions from './../../store/actions/flights.actions';
import { MatDialog } from '@angular/material/dialog';
import { ActionModalComponent } from './../../shared/action-modal/action-modal.component';
import { AddOrDeleteAncillaryServiceComponent } from '../add-or-delete-ancillary-service/add-or-delete-ancillary-service.component';
import { ActivatedRoute } from '@angular/router';

export interface DialogData {
  type: string;
  status: string;
}

export interface AncillaryDialogData {
  action: string;
  type: string;
  fId: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})

export class AdminDashboardComponent implements OnInit {

  public flightsList: Observable<flights.FlightsState[]>;

  public updatedFlightsLoading: Observable<boolean>;

  public flightsListError: Observable<Error>;

  public flightData: Observable<flights.FlightState>;

  public flightDetails: any = {};

  public isShowFlights = false;

  public updatedFlightsList: any[] = [];

  public selectedFlight: any = '';

  public loading = true;

  public isSpecialMeal = false;

  public isAncillaryServices = false;

  public isInflightShoppingRequest = false;

  public flightsState: Observable<flights.FlightsState>;

  public isManagePassengers = false;

  public isPassengerList = false;

  public isModifyPassenger = false;

  public isShoppingItems = false;

  public isSpecialMeals = false;

  public flightDetails$: Observable<flights.FlightState>;

  public flightDetailLoader$: Observable<any>;

  public passengerList: any[] = [];

  public selectedPassenger: any = '';

  public isPassengerModificationSuccessful = false;

  public userObject: any = {};

  public constructor(private route: ActivatedRoute, private store: Store<AppState>, public dialog: MatDialog) { }

  ngOnInit() {

    this.userObject = {
      userImage: this.route.snapshot.paramMap.get('image'),
      userName: this.route.snapshot.paramMap.get('name'),
      type: this.route.snapshot.paramMap.get('type')
    };

    this.flightsList = this.store.select(store => store.flightsState.list);

    this.flightsState = this.store.select(store => store.flightsState);

    this.updatedFlightsLoading = this.store.select(store => store.flightsState.updateFlightsLoading);

    this.store.dispatch(new FlightActions.GetFlightsAction());

    this.flightsState = this.store.select(store => store.flightsState);

    this.flightsList.subscribe((flightDataResponse: any) => {

      this.updatedFlightsList = flightDataResponse;

    });

    this.flightsState.subscribe((flightState: any) => {

      this.loading = flightState.updateFlightsLoading;

      if (!this.loading && (flightState.type === 'passenger-detail' || flightState.type === 'add-ancillary-service' || flightState.type === 'delete-ancillary-service'
        || flightState.type === 'add-special-meals' || flightState.type === 'delete-special-meal'
        || flightState.type === 'add-shopping-items' || flightState.type === 'delete-shopping-item')) {
        this.selectedFlight = '';
        this.selectedPassenger = '';
        this.isModifyPassenger = false;
        this.isManagePassengers = false;
        this.isAncillaryServices = false;
        this.isSpecialMeals = false;
        this.isShoppingItems = false;
        this.openDialog(flightState.type, flightState.updateFlightsError);
      }
    });

  }


  /** 
   * Opens material dialog.
   */
  public openDialog(type: any, errorStatusObj: any): void {

    const status: any = errorStatusObj ? 'failure' : 'success';

    const sampleData: DialogData = { type, status };

    this.dialog.open(ActionModalComponent, {
      width: '30rem',
      data: sampleData
    });

  }

  /**
   * Adds service.
   */
  public addService(type: any): void {

    const sampleData: AncillaryDialogData = { action: 'add', type, fId: this.selectedFlight.id };

    const dialogRef = this.dialog.open(AddOrDeleteAncillaryServiceComponent, {
      width: '30rem',
      data: sampleData
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        const flightData: any = this.selectedFlight;

        let servicesPerFlight: any[] = [];

        if (type === 'ancillary-services') {

          servicesPerFlight = flightData.ancillaryServicesPerFlight;

        } else if (type === 'special-meals') {

          servicesPerFlight = flightData.specialMealsPerFlight;

        } else {

          servicesPerFlight = flightData.shoppingItemsPerFlight;

        }

        result.ancillaryServiceFormArray.forEach((ancillaryService: any) => {

          servicesPerFlight.push(ancillaryService);

        });

        if (type === 'ancillary-services') {

          flightData.ancillaryServicesPerFlight = servicesPerFlight;

        } else if (type === 'special-meals') {

          flightData.specialMealsPerFlight = servicesPerFlight;

        } else {

          flightData.shoppingItemsPerFlight = servicesPerFlight;

        }

        if (type === 'ancillary-services') {

          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData, type: 'add-ancillary-service' }, 'add-ancillary-service'));

        } else if (type === 'shopping-items') {

          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData, type: 'add-shopping-items' }, 'add-shopping-items'));

        } else {

          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData, type: 'add-special-meals' }, 'add-special-meals'));

        }

      }

    });

  }

  /**
   * Deletes service.
   */
  public deleteService(type: any): void {

    const sampleData: AncillaryDialogData = { action: 'delete', type, fId: this.selectedFlight.id };

    const dialogRef = this.dialog.open(AddOrDeleteAncillaryServiceComponent, {
      width: '30rem',
      data: sampleData
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        const flightData: any = this.selectedFlight;

        let servicesPerFlight: any[];

        if (type === 'ancillary-services') {

          servicesPerFlight = flightData.ancillaryServicesPerFlight;

        } else if (type === 'special-meals') {

          servicesPerFlight = flightData.specialMealsPerFlight;

        } else {

          servicesPerFlight = flightData.shoppingItemsPerFlight;

        }

        servicesPerFlight.forEach((anciService: any, index: any) => {

          if (result.label === anciService.label) {

            servicesPerFlight.splice(index, 1);

          }

        });

        if (type === 'ancillary-services') {

          flightData.ancillaryServicesPerFlight = servicesPerFlight;

        } else if (type === 'special-meals') {

          flightData.specialMealsPerFlight = servicesPerFlight;

        } else {

          flightData.shoppingItemsPerFlight = servicesPerFlight;

        }

        if (type === 'ancillary-services') {

          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData, type: 'delete-ancillary-service' }, 'delete-ancillary-service'));

        } else if (type === 'shopping-items') {

          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData, type: 'delete-shopping-item' }, 'delete-shopping-item'));

        } else {

          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData, type: 'delete-special-meal' }, 'delete-special-meal'));

        }

      }

    });

  }

  /**
   * 
   * Updates flight data in json-server.
   * 
   * @param event 
   * @param type
   * 
   */
  public updateCheckedInPayload(event: any, type: any): void {

    const flightData: any = this.updatedFlightsList[this.updatedFlightsList.findIndex((d => d.id === event.flightId))];

    flightData.seatConfig = event.seatList;

    this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: event.flightId, flightData, type }, type));

    this.selectedFlight = '';

    this.flightDetails = '';

  }

  /**
   * 
   * Dispatch the flight id action and hide all the buttons.
   * 
   * @param selectedFlightData
   * 
   */
  public onFlightSelectionChanged(selectedFlightData: any): void {

    if (selectedFlightData && selectedFlightData.value.id) {

      this.store.dispatch(new FlightActions.GetFlightDetailsAction(selectedFlightData.value.id));

    }

    this.isManagePassengers = false;

    this.isModifyPassenger = false;

    this.isPassengerList = false;

    this.isSpecialMeal = false;

    this.isAncillaryServices = false;

    this.isShoppingItems = false;

    this.selectedPassenger = '';

  }

  /**
   * 
   * Show manage options.
   * 
   * @param actionType
   * 
   */
  public showManageOptions(actionType: string): void {

    if (actionType === 'isManagePassengers') {

      this.isAncillaryServices = false;
      this.isManagePassengers = true;
      this.isShoppingItems = false;
      this.isSpecialMeals = false;
      this.isModifyPassenger = false;
      this.isPassengerList = false;

    } else if (actionType === 'isAncillaryServices') {

      this.isAncillaryServices = true;
      this.isManagePassengers = false;
      this.isShoppingItems = false;
      this.isSpecialMeals = false;
      this.isModifyPassenger = false;
      this.isPassengerList = false;

    } else if (actionType === 'isSpecialMeals') {

      this.isAncillaryServices = false;
      this.isManagePassengers = false;
      this.isShoppingItems = false;
      this.isSpecialMeals = true;
      this.isModifyPassenger = false;
      this.isPassengerList = false;

    } else {

      this.isAncillaryServices = false;
      this.isManagePassengers = false;
      this.isShoppingItems = true;
      this.isSpecialMeals = false;
      this.isModifyPassenger = false;
      this.isPassengerList = false;

    }

  }

  /**
   * 
   * Show passenger options.
   * 
   * @param actionType
   */
  public showPassengerOptions(actionType: string): void {

    if (actionType === 'isModifyPassenger') {

      this.isPassengerList = false;
      this.isModifyPassenger = true;
      this.getPassengerList(this.selectedFlight.seatConfig);

    } else if (actionType === 'isPassengerList') {

      this.isPassengerList = true;
      this.isModifyPassenger = false;

    }

  }

  /**
   * 
   * Gets passenger list.
   * 
   * @param seatConfig
   * 
   */
  public getPassengerList(seatConfig: any[]): void {

    this.passengerList = [];

    if (seatConfig.length > 0) {

      seatConfig[0].seats.forEach((seatInfo: any) => {

        const passengerObj: any = {
          passenger: seatInfo.passengerDetails,
          seatNo: seatInfo.serialNo
        };

        this.passengerList.push(passengerObj);

      });

    }

  }

  /**
   * 
   * Execute on passenger selection changed.
   * 
   * @param event
   * 
   */
  public onPassengerSelectionChanged(event: any): void {

    this.isPassengerModificationSuccessful = false;

  }

  /**
   * 
   * Modifies flight payload.
   * 
   * @param event
   * 
   */
  public modifyFlightPayload(event: any): void {

    const tempFlight: any = this.selectedFlight;

    tempFlight.seatConfig[0].seats.map((seat: any) => {

      if (seat.serialNo === this.selectedPassenger.seatNo) {

        seat.passengerDetails = event.passenger;

        return seat;

      } else {

        return seat;

      }

    });

    this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: tempFlight.id, flightData: tempFlight, type: 'passenger-detail' }, 'passenger-detail'));

  }

}
