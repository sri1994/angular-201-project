import { Component, SimpleChanges, EventEmitter, OnInit, OnChanges, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../../store/app.states';
import * as flights from './../../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import * as FlightActions from './../../store/actions/flights.actions';

@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss']
})

export class SeatMapComponent implements OnInit, OnChanges {

  @Input() fid: string;

  @Output() checkedInPayload: EventEmitter<any> = new EventEmitter();

  public seatConfig: any[] = [];
  public seatmap: any[] = [];
  public isShowSeatLayout = false;
  public isShowFlightDetail = false;
  public flightDetails: any = '';

  private seatChartConfig = {
    showRowsLabel: false,
    showRowWisePricing: false,
    newSeatNoForRow: false
  };

  public cart = {
    selectedSeats: [],
    seatstoStore: [],
    totalamount: 0,
    cartId: '',
    eventId: 0
  };

  public selectedPassengers: any[] = [];

  public flightDetails$: Observable<flights.FlightState>;

  public constructor(private store: Store<AppState>) { }

  public ngOnInit(): void {

    this.flightDetails$ = this.store.select(store => store.flightState.flightData);

    this.store.dispatch(new FlightActions.GetFlightDetailsAction(this.fid));

    this.flightDetails$.subscribe((fData: any) => {

      this.flightDetails = fData;

      this.seatConfig = fData.seatConfig;

      if (this.seatConfig) {

      this.processSeatChart(this.seatConfig);

      }

    });

  }

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.fid.currentValue) {

      this.isShowFlightDetail = false;

      this.isShowSeatLayout = false;

    }

  }

  public processSeatChart(mapData: any[]) {

    this.seatmap = [];

    this.selectedPassengers = [];

    if (mapData.length > 0) {
      let seatNoCounter = 1;
      // tslint:disable-next-line: prefer-for-of
      for (let counter = 0; counter < mapData.length; counter++) {
        let rowLabel = '';
        const itemMap = mapData[counter].seat_map;

        // Get the label name and price
        rowLabel = 'Row ' + itemMap[0].seat_label + ' - ';
        if (itemMap[itemMap.length - 1].seat_label !== ' ') {
          rowLabel += itemMap[itemMap.length - 1].seat_label;
        } else {
          rowLabel += itemMap[itemMap.length - 2].seat_label;
        }
        rowLabel += ' : Rs. ' + mapData[counter].seat_price;

        itemMap.forEach((mapElement: any) => {
          const mapObj = {
            seatRowLabel: mapElement.seat_label,
            seats: [],
            seatPricingInformation: rowLabel
          };
          rowLabel = '';
          const seatValArr = mapElement.layout.split('');
          if (this.seatChartConfig.newSeatNoForRow) {
            seatNoCounter = 1; // Reset the seat label counter for new row
          }
          let totalItemCounter = 1;
          seatValArr.forEach((item: any) => {
            const seatObj = {
              key: mapElement.seat_label + '_' + totalItemCounter,
              price: mapData[counter].seat_price,
              status: 'available',
              seatLabel: '',
              seatNo: '',
              passengerStatus: '',
              isPassengerWithInfant: '',
              isPassengerWithWheelChair: '',
              passengerDetails: ''
            };

            if (item !== '_') {
              seatObj.seatLabel = mapElement.seat_label + ' ' + seatNoCounter;
              if (seatNoCounter < 10) { seatObj.seatNo = '0' + seatNoCounter; } else { seatObj.seatNo = '' + seatNoCounter; }

              seatNoCounter++;
            } else {
              seatObj.seatLabel = '';
            }
            totalItemCounter++;
            seatObj.passengerStatus = this.getStatus(mapData[0].seats, seatObj.seatNo);
            seatObj.isPassengerWithInfant = this.isPassengerWithInfant(mapData[0].seats, seatObj.seatNo);
            seatObj.isPassengerWithWheelChair = this.isPassengerWithWheelChair(mapData[0].seats, seatObj.seatNo);
            seatObj.passengerDetails = this.getPassengerDetails(mapData[0].seats, seatObj.seatNo);
            mapObj.seats.push(seatObj);
            if (seatObj.passengerStatus) {
              this.selectedPassengers.push(seatObj);
            }
          });
          this.seatmap.push(mapObj);

        });
      }

    }
  }

  public getStatus(seats: any[], seatNo: any): any {
    const statusObj: any = seats.filter((seat: any) => {
      return seat.serialNo === seatNo;
    });
    return statusObj && statusObj[0] && statusObj[0].status && statusObj[0].status.checkedIn ? statusObj[0].status.checkedIn : false;
  }

  public isPassengerWithInfant(seats: any[], seatNo: any): any {
    const statusObj: any = seats.filter((seat: any) => {
      return seat.serialNo === seatNo;
    });
    return statusObj && statusObj[0] && statusObj[0].status && statusObj[0].status.withInfant ? statusObj[0].status.withInfant : false;
  }

  public isPassengerWithWheelChair(seats: any[], seatNo: any): any {
    const statusObj: any = seats.filter((seat: any) => {
      return seat.serialNo === seatNo;
    });
    return statusObj && statusObj[0] && statusObj[0].status && statusObj[0].status.wheelChair ? statusObj[0].status.wheelChair : false;
  }

  public getPassengerDetails(seats: any[], seatNo: any): any {
    const statusObj: any = seats.filter((seat: any) => {
      return seat.serialNo === seatNo;
    });
    return statusObj && statusObj[0] && statusObj[0].passengerDetails ? statusObj && statusObj[0] && statusObj[0].passengerDetails : '';
  }

  public selectSeat(seatObject: any) {

    if (!seatObject.passengerStatus) {
      seatObject.status = 'booked';
      seatObject.passengerStatus = true;
      this.cart.selectedSeats.push(seatObject.seatLabel);
      this.cart.seatstoStore.push(seatObject.key);
      this.cart.totalamount += seatObject.price;
    } else if (seatObject.passengerStatus) {
      seatObject.status = 'available';
      seatObject.passengerStatus = false;
      const seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatLabel);
      if (seatIndex > -1) {
        this.cart.selectedSeats.splice(seatIndex, 1);
        this.cart.seatstoStore.splice(seatIndex, 1);
        this.cart.totalamount -= seatObject.price;
      }

    }

    if (seatObject.passengerStatus) {
      if (this.selectedPassengers.findIndex((seat) => seat.seatNo === seatObject.seatNo) === -1) {
        this.selectedPassengers.push(seatObject);
      }
    } else {
      const index = this.selectedPassengers.findIndex((seat) => seat.seatNo === seatObject.seatNo);
      this.selectedPassengers.splice(this.selectedPassengers.findIndex((seat) => this.getSeatObject(seatObject, seat)), 1);
      this.selectedPassengers.push(seatObject);
    }
  }

  public getSeatObject(seatObject: any, seat: any): any {
    return seat.seatNo === seatObject.seatNo;
  }
  
  /**
   * 
   * Formats payload.
   * 
   */
  public formatPayload(): void {

    const seatList: any[] = this.seatConfig;

    this.selectedPassengers.forEach((passenger: any) => {

      seatList[0].seats.forEach((seat: any, index: any) => {

        if (seat.serialNo === passenger.seatNo) {

          seatList[0].seats[index].status.checkedIn = passenger.passengerStatus;

          return false;

        } else {

          return true;

        }

      });

    });

    this.checkedInPayload.emit({ seatList, flightId: this.fid });
    
  }

}
