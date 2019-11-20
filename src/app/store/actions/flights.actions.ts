import { Action } from '@ngrx/store';
import { Flight } from '../../models/flight';

export const GET_FLIGHTS = '[FLIGHTS] Get Flights';
export const GET_FLIGHTS_SUCCESS = '[FLIGHTS] Get Flights Success';
export const GET_FLIGHTS_FAILURE = '[FLIGHTS] Get Flights Failure';
export const GET_FLIGHT_DETAILS = '[FLIGHT] Get Flight Details';
export const GET_FLIGHT_DETAILS_SUCCESS = '[LOGIN] Get Flight Details Success';
export const GET_FLIGHT_DETAILS_FAILURE = '[LOGIN] Get Flight Details Failure';
export const UPDATE_FLIGHTS_LIST = '[FLIGHTS] Upate Flights List';
export const UPDATE_FLIGHTS_LIST_SUCCESS = '[FLIGHTS] Update Flights List Success';
export const UPDATE_FLIGHTS_LIST_FAILURE = '[FLIGHTS] Update Flights List Failure';

export class GetFlightsAction implements Action {
    public readonly type = GET_FLIGHTS;
}

export class GetFlightsSuccessAction implements Action {
    public readonly type = GET_FLIGHTS_SUCCESS;

    constructor(public payload: Flight[]) {

    }
}

export class GetFlightsFailureAction implements Action {
    public readonly type = GET_FLIGHTS_FAILURE;

    constructor(public payload: Error) {

    }
}

export class GetFlightDetailsAction implements Action {
    public readonly type = GET_FLIGHT_DETAILS;

    constructor(public payload: string) {

    }
}

export class GetFlightDetailsSuccessAction implements Action {
    public readonly type = GET_FLIGHT_DETAILS_SUCCESS;

    constructor(public payload: any) {

    }
}

export class GetFlightDetailsFailureAction implements Action {
    public readonly type = GET_FLIGHT_DETAILS_FAILURE;

    constructor(public payload: Error) {

    }
}

export class UpdateFlightsListAction implements Action {
    public readonly type = UPDATE_FLIGHTS_LIST;

    constructor(public payload: any, public payloadType: any) {

    }
}

export class UpdateFlightsListSuccessAction implements Action {
    public readonly type = UPDATE_FLIGHTS_LIST_SUCCESS;

    constructor(public payload: any, public payloadType: any) {

    }
}

export class UpdateFlightsListFailureAction implements Action {
    public readonly type = UPDATE_FLIGHTS_LIST_FAILURE;

    constructor(public payload: Error, public payloadType: any) {

    }
}


export type Actions = UpdateFlightsListFailureAction | UpdateFlightsListSuccessAction | UpdateFlightsListAction | GetFlightDetailsFailureAction | GetFlightDetailsSuccessAction | GetFlightDetailsAction | GetFlightsAction | GetFlightsSuccessAction | GetFlightsFailureAction;
