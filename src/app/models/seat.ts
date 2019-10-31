import { status } from './status';
import { passenger } from './passenger';

export interface seat {
    "serialNo": string;
    "status": status;
    "passenger": passenger;
}