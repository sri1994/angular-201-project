import { Status } from './status';
import { Passenger } from './passenger';

export interface Seat {
    'serialNo': string;
    'status': Status;
    'passenger': Passenger;
}
