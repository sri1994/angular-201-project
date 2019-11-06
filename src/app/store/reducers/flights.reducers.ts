import { Flight } from '../../models/Flight';
import * as FlightActions from '../actions/flights.actions';

export interface flightsState {
  list: any[];
  flightsListLoading: boolean;
  updateFlightsLoading: boolean;
  flightsListError: Error;
  updateFlightsError: Error;
  type: any;
};

export interface flightState {
    flightData: any;
    loading: false;
    error: Error;
  };

export const initialFlightsState: flightsState = {
  list: [],
  flightsListLoading: true,
  updateFlightsLoading: true,
  flightsListError: undefined,
  updateFlightsError: undefined,
  type: undefined
};

export const initialFlightState: flightState = {
    flightData: {},
    loading: false,
    error: undefined
  };

export function flightsReducer(state: flightsState = initialFlightsState, action: FlightActions.Actions) {
  console.log('STATE :', state);
  console.log('Action :', action);
  switch(action.type) {
    case FlightActions.GET_FLIGHTS: {
      return { ...state, flightsListLoading: true, updateFlightsLoading: true};
    }
    case FlightActions.GET_FLIGHTS_SUCCESS: {
      return {...state, list: action.payload, flightsListLoading: false, updateFlightsLoading: true};
    }
    case FlightActions.GET_FLIGHTS_FAILURE: {
      return {...state, flightsListError: action.payload, flightsListLoading: false, updateFlightsLoading: true};
    }
    case FlightActions.UPDATE_FLIGHTS_LIST: {
      return { ...state, flightsListLoading: true, updateFlightsLoading: true, type: action.payloadType};
    }
    case FlightActions.UPDATE_FLIGHTS_LIST_SUCCESS: {
      return {...state, list: modifyList(state.list, action.payload), flightsListLoading: true, updateFlightsLoading: false, type: action.payloadType};
    }
    case FlightActions.UPDATE_FLIGHTS_LIST_FAILURE: {
      return {...state, updateFlightsError: action.payload, flightsListLoading: true, updateFlightsLoading: false, type: action.payloadType};
    }
    // case FlightActions.GET_FLIGHT_DETAILS: {
    //   return { ...state, loading: true};
    // }
    // case FlightActions.GET_FLIGHT_DETAILS_SUCCESS: {
    //   return {...state, list: getFlight(state.list, action.payload), loading: false};
    // }
    // case FlightActions.GET_FLIGHT_DETAILS_FAILURE: {
    //   return {...state, error: action.payload, loading: false};
    // }
    default:
      return state;
  }
}

export function flightReducer(state: flightState = initialFlightState, action: FlightActions.Actions) {
    switch(action.type) {
      case FlightActions.GET_FLIGHT_DETAILS: {
        return {...state, loading: true};
      }
      case FlightActions.GET_FLIGHT_DETAILS_SUCCESS: {
        return {...state, flightData: action.payload, loading: false};
      }
      case FlightActions.GET_FLIGHT_DETAILS_FAILURE: {
        return {...state, error: action.payload, loading: false};
      }
      default:
        return state;
    }
  }

function getFlight(list: any[], payload: string): any {
  const listMap = list.filter(listItem => listItem.id === payload);
  return listMap[0];
}

function modifyList(list: any[], payload: any): any {
  const listMap = list.map(item => {
    if (item.id === payload.id) {
      return payload;
    } else {
      return item;
    }
  });
  return listMap;
}