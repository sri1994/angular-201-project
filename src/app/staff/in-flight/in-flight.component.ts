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
  selector: 'app-in-flight',
  templateUrl: './in-flight.component.html',
  styleUrls: ['./in-flight.component.scss']
})

export class InFlightComponent implements OnInit {

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

  public constructor(private store: Store<AppState>, public dialog: MatDialog) { }

  public ngOnInit(): void {

    this.flightsList = this.store.select(store => store.flightsState.list);

    this.flightsState = this.store.select(store => store.flightsState);

    this.store.dispatch(new FlightActions.GetFlightsAction());

    this.flightData = this.store.select(store => store.flightState.flightData);
    
    this.flightsList.subscribe((data1: any) => {

      this.updatedFlightsList = data1;

    });

    this.flightsState.subscribe((flightState: any) => {

      this.loading = flightState.updateFlightsLoading;

      if (!this.loading && (flightState.type === 'special-meal' || flightState.type === 'ancillary-services' || flightState.type === 'add-in-flight-shopping')) {
        
        this.openDialog(flightState.type, flightState.updateFlightsError);

      }

    });

  }
  
  /**
   * 
   * Show flights.
   * 
   * @param actionType 
   */
  public showFlights(actionType: string): void {

    this.isShowFlights = true;

    if (actionType === 'specialMeal') {

      this.selectedFlight = '';

      this.isAncillaryServices = false;

      this.isInflightShoppingRequest = false;

      this.isSpecialMeal = true;

    } else if (actionType === 'ancillaryServices') {

      this.isSpecialMeal = false;

      this.isAncillaryServices = true;

      this.isInflightShoppingRequest = false;

    } else if (actionType === 'inFlightShoppingRequest') {

      this.isSpecialMeal = false;

      this.isAncillaryServices = false;

      this.isInflightShoppingRequest = true;

    }

  }
  
  /**
   * 
   * Update flight data in json-server.
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
   * On flight selection changed, dispatches details action.
   * 
   * @param selectedFlightData
   * 
   */
  public onFlightSelectionChanged(selectedFlightData: any): void {

    if (selectedFlightData && selectedFlightData.value.id) {

      this.store.dispatch(new FlightActions.GetFlightDetailsAction(selectedFlightData.value.id));

    }

  }

  /**
   * 
   * Opens dialog.
   * 
   * @param type 
   * @param errorStatusObj
   *  
   */
  public openDialog(type: any, errorStatusObj: any): void {

    const status: any = errorStatusObj ? 'failure' : 'success';

    const sampleData: DialogData = { type, status };

    this.dialog.open(ActionModalComponent, {
      width: '30rem',
      data: sampleData
    });

  }

}
