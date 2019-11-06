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


export interface DialogData {
  type: string;
  status: string;
}

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {

  public flightsList: Observable<flights.flightsState[]>;
  public updateFlightsLoading: Observable<Boolean>;
  public flightsListError: Observable<Error>;

  public flightData: Observable<flights.flightState>;

  public flightDetails: any = {};

  public isShowFlights: boolean = false;

  public updatedFlightsList: any[] = [];

  public selectedFlight: any = '';

  public loading: boolean = true;

  public isShowPassengers: boolean = false;

  public isCheckInPassenger: boolean = false;

  public flightsState: Observable<flights.flightsState>;

  constructor(private store: Store<AppState>, public dialog: MatDialog) { }

  ngOnInit() {
    this.flightsList = this.store.select(store => store.flightsState.list);
    this.flightsState = this.store.select(store => store.flightsState);
    this.updateFlightsLoading = this.store.select(store => store.flightsState.updateFlightsLoading);
    this.store.dispatch(new FlightActions.GetFlightsAction());
    // this.store.dispatch(new FlightActions.GetFlightDetailsAction('f1'));

    this.flightData = this.store.select(store => store.flightState.flightData);
    // this.store.dispatch(new FlightActions.GetFlightDetailsAction('f1'));

    this.flightsList.subscribe((data1: any) => {
      console.log('FLIGHT LIST :', data1);
      this.updatedFlightsList = data1;
    });

    // this.flightData.subscribe((data: any) => {
    //   console.log('FLIGHT DATA :', data);
    //   this.flightDetails = data;
    // });

    // this.updateFlightsLoading.subscribe((loading: boolean) => {
    //   this.loading = loading;
    //   console.log('Loading in checkin :', this.loading);
    //   if (!this.loading) {
    //     this.openDialog();
    //   }
    // });

    this.flightsState.subscribe((flightState: any) => {
      console.log('FLIGHTSTATE in subscription :', flightState);
      this.loading = flightState.updateFlightsLoading;
      console.log('Loading in checkin :', this.loading);
      if (!this.loading && flightState.type === 'check-in') {
        this.openDialog();
      }
    });
  }

  public showFlights(actionType: string): void {
    this.isShowFlights = true;
    if (actionType === 'showPassenger') {
      this.selectedFlight = '';
      this.isCheckInPassenger = false;
      this.isShowPassengers = true;
    } else if (actionType === 'checkInPassenger') {
      this.isShowPassengers = false;
      this.isCheckInPassenger = true;
    }
  }

  public updateCheckedInPayload(event: any): void {
    console.log('Event :', event);
    const flightData: any = this.updatedFlightsList[this.updatedFlightsList.findIndex((d => d.id === event.flightId))];
    flightData.seatConfig = event.seatList;
    this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: event.flightId, flightData: flightData, type: 'check-in' }, 'check-in'));
    this.selectedFlight = '';
    this.flightDetails = '';
  }

  openDialog(): void {
    const sampleData: DialogData = { type: 'check-in', status: 'success' }
    const dialogRef = this.dialog.open(ActionModalComponent, {
      width: '250px',
      data: sampleData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  public onFlightSelectionChanged(selectedFlightData: any): void {
    console.log('SELECTED FLIGHT :', selectedFlightData);
    if (selectedFlightData && selectedFlightData.value.id) {
      this.store.dispatch(new FlightActions.GetFlightDetailsAction(selectedFlightData.value.id));
    }
  }

}
