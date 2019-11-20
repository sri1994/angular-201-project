import { Component, OnInit } from '@angular/core';
import * as flights from './../../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './../../store/app.states';
import * as FlightActions from './../../store/actions/flights.actions';
import { MatDialog } from '@angular/material/dialog';
import { ActionModalComponent } from './../../shared/action-modal/action-modal.component';

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

  public flightsList: Observable<flights.FlightsState[]>;

  public updateFlightsLoading: Observable<boolean>;

  public flightsListError: Observable<Error>;

  public flightData: Observable<flights.FlightState>;

  public flightDetails: any = {};

  public isShowFlights = false;

  public updatedFlightsList: any[] = [];

  public selectedFlight: any = '';

  public loading = true;

  public isShowPassengers = false;

  public isCheckInPassenger = false;

  public flightsState: Observable<flights.FlightsState>;

  public constructor(private store: Store<AppState>, public dialog: MatDialog) { }

  public ngOnInit(): void {

    this.flightsList = this.store.select(store => store.flightsState.list);

    this.flightsState = this.store.select(store => store.flightsState);

    this.updateFlightsLoading = this.store.select(store => store.flightsState.updateFlightsLoading);

    this.store.dispatch(new FlightActions.GetFlightsAction());

    this.flightData = this.store.select(store => store.flightState.flightData);

    this.flightsList.subscribe((data1: any) => {

      this.updatedFlightsList = data1;

    });

    this.flightsState.subscribe((flightState: any) => {

      this.loading = flightState.updateFlightsLoading;

      if (!this.loading && flightState.type === 'check-in') {

        this.openDialog();

      }

    });

  }
  
  /**
   * 
   * Shows flights.
   * 
   * @param actionType.
   * 
   */
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
  
  /**
   * 
   * Updates checked in payload.
   * 
   * @param event
   * 
   */
  public updateCheckedInPayload(event: any): void {

    const flightData: any = this.updatedFlightsList[this.updatedFlightsList.findIndex((d => d.id === event.flightId))];
    
    flightData.seatConfig = event.seatList;

    this.store.dispatch(new FlightActions.UpdateFlightsListAction({ flightId: event.flightId, flightData, type: 'check-in' }, 'check-in'));
    
    this.selectedFlight = '';

    this.flightDetails = '';

  }
  
  /**
   * 
   * Opens dialog.
   * 
   */
  public openDialog(): void {

    const sampleData: DialogData = { type: 'check-in', status: 'success' };

    this.dialog.open(ActionModalComponent, {
      width: '250px',
      data: sampleData
    });
  
  }
  
  /**
   * 
   * On flight selection change, dispatches flight details action.
   * 
   * @param selectedFlightData
   * 
   */
  public onFlightSelectionChanged(selectedFlightData: any): void {

    if (selectedFlightData && selectedFlightData.value.id) {

      this.store.dispatch(new FlightActions.GetFlightDetailsAction(selectedFlightData.value.id));

    }
    
  }

}
