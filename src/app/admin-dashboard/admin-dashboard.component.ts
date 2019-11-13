import { Component, OnInit } from '@angular/core';
import * as flights from './../store/reducers/flights.reducers';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as FlightActions from './../store/actions/flights.actions';
import { FlightsService } from './../flights.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionModalComponent } from '../action-modal/action-modal.component';
import { sample } from 'rxjs/operators';
import { AddOrDeleteAncillaryServiceComponent } from '../add-or-delete-ancillary-service/add-or-delete-ancillary-service.component';
import { TouchSequence } from 'selenium-webdriver';

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

  public flightsList: Observable<flights.flightsState[]>;
  public updatedFlightsLoading: Observable<Boolean>;
  public flightsListError: Observable<Error>;

  public flightData: Observable<flights.flightState>;

  public flightDetails: any = {};

  public isShowFlights: boolean = false;

  public updatedFlightsList: any[] = [];

  public selectedFlight: any = '';

  public loading: boolean = true;

  public isSpecialMeal: boolean = false;

  public isAncillaryServices: boolean = false;

  public isInflightShoppingRequest: boolean = false;

  public flightsState: Observable<flights.flightsState>;

  public isManagePassengers: boolean = false;

  public isPassengerList: boolean = false;
  public isModifyPassenger: boolean = false;
  public isShoppingItems: boolean = false;
  public isSpecialMeals: boolean = false;

  public flightDetails$: Observable<flights.flightState>;
  public flightDetailLoader$: Observable<any>;

  public passengerList: any[] = [];

  public selectedPassenger: any = ''

  public isPassengerModificationSuccessful: boolean = false;

  constructor(private store: Store<AppState>, public dialog: MatDialog) { }

  ngOnInit() {
    this.flightsList = this.store.select(store => store.flightsState.list);
    this.flightsState = this.store.select(store => store.flightsState);
    this.updatedFlightsLoading = this.store.select(store => store.flightsState.updateFlightsLoading);
    this.store.dispatch(new FlightActions.GetFlightsAction());
    this.flightsState = this.store.select(store => store.flightsState);
    // this.store.dispatch(new FlightActions.GetFlightDetailsAction('f1'));

    // this.flightData = this.store.select(store => store.flightState.flightData);
    // this.store.dispatch(new FlightActions.GetFlightDetailsAction('f1'));
    // this.flightDetails$ = this.store.select(store => store.flightState.flightData);
    // this.flightDetailLoader$ = this.store.select(store => store.flightState.loading);

    this.flightsList.subscribe((data1: any) => {
      console.log('FLIGHT LIST :', data1);
      this.updatedFlightsList = data1;
    });

    // this.flightDetails$.subscribe(fData => {
    //   // this.changeDetector.detectChanges();
    //   this.flightDetails = fData;
    //   this.seatConfig = fData['seatConfig'];
    //   console.log('fData in flightDetails$ :', fData['seatConfig']);
    //   if (this.seatConfig) {
    //     this.isSeatLayoutLoading = false;
    //     this.isEditSeatLayout = false;
    //     this.getPassengerList(this.seatConfig);
    //     this.changeDetector.markForCheck();
    //   }
    // });

    this.flightsState.subscribe((flightState: any) => {
      console.log('FLIGHTSTATE in subscription :', flightState);
      this.loading = flightState.updateFlightsLoading;
      console.log('Loading in checkin :', this.loading);
      if (!this.loading && (flightState.type === 'passenger-detail' || flightState.type === 'add-ancillary-service' || flightState.type === 'delete-ancillary-service'
      || flightState.type === 'add-special-meals' || flightState.type === 'delete-special-meal'
      || flightState.type === 'add-shopping-items' || flightState.type === 'delete-shopping-item')) {
        this.selectedFlight = '';
        this.selectedPassenger = '';
        this.isModifyPassenger = false;
        this.isAncillaryServices = false;
        this.isSpecialMeals = false;
        this.isShoppingItems = false;
        this.openDialog(flightState.type, flightState.updateFlightsError);
      }
    });

  }


  public openDialog(type: any, errorStatusObj: any): void {
    let status: any = errorStatusObj ? 'failure' : 'success';
    const sampleData: DialogData = { type, status }
    const dialogRef = this.dialog.open(ActionModalComponent, {
      width: '30rem',
      data: sampleData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  public addService(type: any): void {
    const sampleData: AncillaryDialogData = { action: 'add', type, fId: this.selectedFlight.id }
    const dialogRef = this.dialog.open(AddOrDeleteAncillaryServiceComponent, {
      width: '30rem',
      data: sampleData
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log('Result ancillary service :', result);
        const flightData: any = this.selectedFlight;
        let servicesPerFlight: any[];
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
        console.log('FlightData :', flightData);
        if (type === 'ancillary-services') {
        this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData: flightData, type: 'add-ancillary-service' }, 'add-ancillary-service'));
        } else if (type === 'shopping-items') {
          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData: flightData, type: 'add-shopping-items' }, 'add-shopping-items'));
        } else {
          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData: flightData, type: 'add-special-meals' }, 'add-special-meals'));
        }
      }
    });

  }

  public deleteService(type: any): void {
    const sampleData: AncillaryDialogData = { action: 'delete', type, fId: this.selectedFlight.id }
    const dialogRef = this.dialog.open(AddOrDeleteAncillaryServiceComponent, {
      width: '30rem',
      data: sampleData
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log('Result ancillary service :', result);
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
            console.log('RESULT DATA ARE EQUAL');
            servicesPerFlight.splice(index, 1);
          }
        });

        if (type === 'ancillary-services') {
        // ancillaryServicesPerFlight.splice(ancillaryServicesPerFlight.indexOf(result));
        flightData.ancillaryServicesPerFlight = servicesPerFlight;
        } else if (type === 'special-meals') {
          flightData.specialMealsPerFlight = servicesPerFlight;
        } else {
          flightData.shoppingItemsPerFlight = servicesPerFlight;
        }
        console.log('FlightData :', flightData);
        if (type === 'ancillary-services') {
          this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData: flightData, type: 'delete-ancillary-service' }, 'delete-ancillary-service'));
          } else if (type === 'shopping-items') {
            this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData: flightData, type: 'delete-shopping-item' }, 'delete-shopping-item'));
          } else {
            this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: this.selectedFlight.id, flightData: flightData, type: 'delete-special-meal' }, 'delete-special-meal'));
          }
      }
    });

  }

  public updateCheckedInPayload(event: any, type: any): void {
    console.log('Event :', event);
    const flightData: any = this.updatedFlightsList[this.updatedFlightsList.findIndex((d => d.id === event.flightId))];
    flightData.seatConfig = event.seatList;
    this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: event.flightId, flightData: flightData, type: type }, type));
    this.selectedFlight = '';
    this.flightDetails = '';
  }

  public onFlightSelectionChanged(selectedFlightData: any): void {
    console.log('SELECTED FLIGHT :', selectedFlightData);
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

  public showManageOptions(actionType: string): void {
    if (actionType === 'isManagePassengers') {
      this.isAncillaryServices = false;
      this.isManagePassengers = true;
      this.isShoppingItems = false;
      this.isSpecialMeals = false;
    } else if (actionType === 'isAncillaryServices') {
      this.isAncillaryServices = true;
      this.isManagePassengers = false;
      this.isShoppingItems = false;
      this.isSpecialMeals = false;
    } else if (actionType === 'isSpecialMeals') {
      this.isAncillaryServices = false;
      this.isManagePassengers = false;
      this.isShoppingItems = false;
      this.isSpecialMeals = true;
    } else {
      this.isAncillaryServices = false;
      this.isManagePassengers = false;
      this.isShoppingItems = true;
      this.isSpecialMeals = false;
    }
  }

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

  public getPassengerList(seatConfig: any[]): void {
    this.passengerList = [];
    console.log('SEATCONFIG :', seatConfig);
    if (seatConfig.length > 0) {
      seatConfig[0].seats.forEach((seatInfo: any) => {
        const passengerObj: any = {
          passenger: seatInfo.passengerDetails,
          seatNo: seatInfo.serialNo
        }
        this.passengerList.push(passengerObj);
      })
    }
  }

  public onPassengerSelectionChanged(event: any): void {
    console.log('PASSENGER SELECTED :', this.selectedPassenger);
    this.isPassengerModificationSuccessful = false;
  }

  public modifyFlightPayload(event: any): void {
    console.log('Event :', event);
    // this.selectedPassenger = '';
    // this.isPassengerModificationSuccessful = true;
    // const modifiedFlightPayload: any = this.selectedFlight;
    // const selectedPassengerSeat: any[] = this.selectedFlight.seatConfig[0].seats.filter((seat: any) => {
    //   return seat.serialNo === this.selectedPassenger.seatNo;
    // });

    const tempFlight: any = this.selectedFlight;

    tempFlight.seatConfig[0].seats.map((seat: any) => {
      if (seat.serialNo === this.selectedPassenger.seatNo) {
        seat.passengerDetails = event.passenger;
        return seat;
      } else {
        return seat;
      }
    });

    console.log('SELECTED FLIGHT AFTER SUBMIT :', tempFlight);

    this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: tempFlight.id, flightData: tempFlight, type: 'passenger-detail' }, 'passenger-detail'));

  }

}
