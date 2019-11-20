import { Seat } from './seat';

export class Flight {
    'id': string;
    'name': string;
    'details': {
        'origin': string;
        'destination': string;
        'timeOfDeparture': string;
        'jpurneyHours': string;
        'noOfPassengers': number
    };
    'seatConfig': [
        {
        'seat_price': number;
        'seats': [
            Seat
         ],
         'seat_map': [
             {
                 'seat_label': string;
                 'layout': string;
             }
         ]
        }
    ];
}
