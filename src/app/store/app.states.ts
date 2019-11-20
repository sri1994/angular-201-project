import * as auth from './reducers/auth.reducers';
import * as flight from './reducers/flights.reducers';

export interface AppState {
  authState: auth.State;
  flightState: flight.FlightState;
  flightsState: flight.FlightsState;
}
