import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as FlightActions from './../actions/flights.actions';
import { FlightsService } from './../../flights.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class FlightEffects {
    @Effect() getFlights$ = this.actions$.pipe(ofType<FlightActions.GetFlightsAction>(FlightActions.GET_FLIGHTS),
        mergeMap(
            () => this.flightsService.getFlightsList()
                .pipe(
                    map(data => new FlightActions.GetFlightsSuccessAction(data)),
                    catchError(error => of(new FlightActions.GetFlightsFailureAction(error)))
                )
        )
    );

    @Effect() getFlightDetails$ = this.actions$.pipe(ofType<FlightActions.GetFlightDetailsAction>(FlightActions.GET_FLIGHT_DETAILS),
        mergeMap(
            (data) => this.flightsService.getFlightDetail(data.payload)
                .pipe(
                    map(data => new FlightActions.GetFlightDetailsSuccessAction(data)),
                    catchError(error => of(new FlightActions.GetFlightDetailsFailureAction(error)))
                )
        )
    );

    @Effect() updateFlightsList$ = this.actions$.pipe(ofType<FlightActions.UpdateFlightsListAction>(FlightActions.UPDATE_FLIGHTS_LIST),
        mergeMap(
            (dataPayload) => this.flightsService.updateFlightsList(dataPayload.payload)
                .pipe(
                    map(data => new FlightActions.UpdateFlightsListSuccessAction(data, dataPayload.payloadType)),
                    catchError(error => of(new FlightActions.UpdateFlightsListFailureAction(error, dataPayload.payloadType)))
                )
        )
    );

    constructor(private actions$: Actions, private flightsService: FlightsService) {

    }
}