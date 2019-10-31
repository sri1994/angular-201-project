import { Component, SimpleChanges, EventEmitter, OnInit, OnChanges, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as flights from './../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import * as FlightActions from './../store/actions/flights.actions';
import { applySourceSpanToStatementIfNeeded } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss']
})
export class SeatMapComponent implements OnInit, OnChanges {

  // @Input() seatConfigData: Observable<any>;
  @Input() fid: string;

  @Output() checkedInPayload: EventEmitter<any> = new EventEmitter();

  public seatConfig: any[] = [];
  public seatmap: any[] = [];
  public isShowSeatLayout: boolean = false;
  public isShowFlightDetail: boolean = false;

  private seatChartConfig = {
    showRowsLabel: false,
    showRowWisePricing: false,
    newSeatNoForRow: false
  }

  private cart = {
    selectedSeats: [],
    seatstoStore: [],
    totalamount: 0,
    cartId: "",
    eventId: 0
  };

  public selectedPassengers: any[] = [];

  title = 'seat-chart-generator';

  public flightDetails$: Observable<flights.flightState>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.flightDetails$ = this.store.select(store => store.flightState.flightData);
    this.store.dispatch(new FlightActions.GetFlightDetailsAction(this.fid));
    this.flightDetails$.subscribe(fData => {
      this.seatConfig = fData['seatConfig'];
      console.log('fData in flightDetails$ :', fData['seatConfig']);
      if (this.seatConfig) {
      this.processSeatChart(this.seatConfig);
      }
    });
    // this.seatConfigData.subscribe((fData: any) => {
    //   console.log('fData :', fData);
    //   this.seatConfig = fData.seatConfig;
    //   this.processSeatChart(this.seatConfig);
    // })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('CHANGES :', changes);
    //Process a simple bus layout
    // this.seatConfig = [
    //   {
    //     "seat_price": 250,
    //     "seats": [
    //       {
    //         "serialNo": "01",
    //         "status": {
    //           "checkedIn": true
    //         },
    //         "passengerDetails": {
    //           "name": "srinivas",
    //           "id": "ertdf3"
    //         }
    //       },
    //       {
    //         "serialNo": "02",
    //         "status": {
    //           "checkedIn": true
    //         },
    //         "passengerDetails": {
    //           "name": "srinivas1",
    //           "id": "ertdf3"
    //         }
    //       },
    //       {
    //         "serialNo": "03",
    //         "status": {
    //           "checkedIn": false
    //         },
    //         "passengerDetails": {
    //           "name": "srinivas2",
    //           "id": "ertdf3"
    //         }
    //       },
    //       {
    //         "serialNo": "04",
    //         "status": {
    //           "checkedIn": false
    //         },
    //         "passengerDetails": {
    //           "name": "srinivas3",
    //           "id": "ertdf3"
    //         }
    //       },
    //       {
    //         "serialNo": "05",
    //         "status": {
    //           "checkedIn": false
    //         },
    //         "passengerDetails": {
    //           "name": "srinivas4",
    //           "id": "ertdf3"
    //         }
    //       },
    //       {
    //         "serialNo": "06",
    //         "status": {
    //           "checkedIn": false
    //         },
    //         "passengerDetails": {
    //           "name": "srinivas5",
    //           "id": "ertdf3"
    //         }
    //       }
    //     ],
    //     "seat_map": [
    //       {
    //         "seat_label": "1",
    //         "layout": "ggg__ggg"
    //       }
    //     ]
    //   }
    // ]

    if (changes.fid.currentValue) {

      console.log('NgOnChanges :', this.fid);

      this.isShowFlightDetail = false;

      this.isShowSeatLayout = false;

    }

    // this.seatConfig = this.seatConfigData;

    // if (this.seatConfig) {

    // this.processSeatChart(this.seatConfig);

    // }

    // }

    //this.seatConfigData.valueChanges.subscribe()

    // ,
    //       {
    //         "seat_label": "2",
    //         "layout": "ggg__ggg"
    //       },
    //       {
    //         "seat_label": "3",
    //         "layout": "ggg__ggg"
    //       },
    //       {
    //         "seat_label": "4",
    //         "layout": "ggg__ggg"
    //       },
    //       {
    //         "seat_label": "5",
    //         "layout": "ggg__ggg"
    //       },
    //       {
    //         "seat_label": "6",
    //         "layout": "ggg__ggg"
    //       },
    //       {
    //         "seat_label": "7",
    //         "layout": "ggg__ggg"
    //       },
    //       {
    //         "seat_label": "8",
    //         "layout": "ggg__ggg"
    //       }

  }

  public processSeatChart(map_data: any[]) {

    this.seatmap = [];

    this.selectedPassengers = [];

    if (map_data.length > 0) {
      var seatNoCounter = 1;
      for (let __counter = 0; __counter < map_data.length; __counter++) {
        var row_label = "";
        var item_map = map_data[__counter].seat_map;

        //Get the label name and price
        row_label = "Row " + item_map[0].seat_label + " - ";
        if (item_map[item_map.length - 1].seat_label != " ") {
          row_label += item_map[item_map.length - 1].seat_label;
        }
        else {
          row_label += item_map[item_map.length - 2].seat_label;
        }
        row_label += " : Rs. " + map_data[__counter].seat_price;

        item_map.forEach(map_element => {
          var mapObj = {
            "seatRowLabel": map_element.seat_label,
            "seats": [],
            "seatPricingInformation": row_label
          };
          row_label = "";
          var seatValArr = map_element.layout.split('');
          if (this.seatChartConfig.newSeatNoForRow) {
            seatNoCounter = 1; //Reset the seat label counter for new row
          }
          var totalItemCounter = 1;
          seatValArr.forEach(item => {
            var seatObj = {
              "key": map_element.seat_label + "_" + totalItemCounter,
              "price": map_data[__counter]["seat_price"],
              "status": "available"
            };

            if (item != '_') {
              seatObj["seatLabel"] = map_element.seat_label + " " + seatNoCounter;
              if (seatNoCounter < 10) { seatObj["seatNo"] = "0" + seatNoCounter; }
              else { seatObj["seatNo"] = "" + seatNoCounter; }

              seatNoCounter++;
            }
            else {
              seatObj["seatLabel"] = "";
            }
            totalItemCounter++;
            seatObj["passengerStatus"] = this.getStatus(map_data[0].seats, seatObj["seatNo"]);
            seatObj["isPassengerWithInfant"] = this.isPassengerWithInfant(map_data[0].seats, seatObj["seatNo"]);
            seatObj["isPassengerWithWheelChair"] = this.isPassengerWithWheelChair(map_data[0].seats, seatObj["seatNo"]);
            seatObj["passengerDetails"] = this.getPassengerDetails(map_data[0].seats, seatObj["seatNo"]);
            mapObj["seats"].push(seatObj);
            if (seatObj['passengerStatus']) {
              this.selectedPassengers.push(seatObj);
            }
          });
          console.log(" \n\n\n Seat Objects ", mapObj);
          this.seatmap.push(mapObj);

        });
      }


      // for (let __counter = 0; __counter < map_data.length; __counter++) {
      //   var row_label = "";
      //   var rowLblArr = map_data[__counter]["seat_labels"];
      //   var seatMapArr = map_data[__counter]["seat_map"];
      //   for (let rowIndex = 0; rowIndex < rowLblArr.length; rowIndex++) {
      //     var rowItem = rowLblArr[rowIndex];
      //     var mapObj = {
      //       "seatRowLabel" : rowItem,
      //       "seats" : []
      //     };
      //     var seatValArr = seatMapArr[rowIndex].split('');
      //     var seatNoCounter = 1;
      //     var totalItemCounter = 1;
      //     seatValArr.forEach(item => {
      //       var seatObj = {
      //         "key" : rowItem+"_"+totalItemCounter,
      //         "price" : map_data[__counter]["seat_price"],
      //         "status" : "available"
      //       };

      //       if( item != '_')
      //       {
      //         seatObj["seatLabel"] = rowItem+" "+seatNoCounter;
      //         if(seatNoCounter < 10)
      //         { seatObj["seatNo"] = "0"+seatNoCounter; }
      //         else { seatObj["seatNo"] = ""+seatNoCounter; }

      //         seatNoCounter++;
      //       }
      //       else
      //       {
      //         seatObj["seatLabel"] = "";
      //       }
      //       totalItemCounter++;
      //       mapObj["seats"].push(seatObj);
      //     });
      //     console.log(" \n\n\n Seat Objects " , mapObj);
      //     this.seatmap.push( mapObj );
      //     console.log(" \n\n\n Seat Map " , this.seatmap);

      //   }

      // }
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
    console.log("Seat to block: ", seatObject);
    if (!seatObject.passengerStatus) {
      seatObject.status = "booked";
      seatObject.passengerStatus = true;
      this.cart.selectedSeats.push(seatObject.seatLabel);
      this.cart.seatstoStore.push(seatObject.key);
      this.cart.totalamount += seatObject.price;
    }
    else if (seatObject.passengerStatus) {
      seatObject.status = "available";
      seatObject.passengerStatus = false;
      var seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatLabel);
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
      console.log('INDEX :', index);
      this.selectedPassengers.splice(this.selectedPassengers.findIndex((seat) => this.someMethod(seatObject, seat)), 1);
      this.selectedPassengers.push(seatObject);
    }
  }

  public someMethod(seatObject: any, seat: any): any {
    console.log('SEATOBJECT :', seatObject, 'SEAT :', seat, ' ', seat.seatNo === seatObject.seatNo);
    return seat.seatNo === seatObject.seatNo;
  }

  public blockSeats(seatsToBlock: string) {
    if (seatsToBlock != "") {
      var seatsToBlockArr = seatsToBlock.split(',');
      for (let index = 0; index < seatsToBlockArr.length; index++) {
        var seat = seatsToBlockArr[index] + "";
        var seatSplitArr = seat.split("_");
        console.log("Split seat: ", seatSplitArr);
        for (let index2 = 0; index2 < this.seatmap.length; index2++) {
          const element = this.seatmap[index2];
          if (element.seatRowLabel == seatSplitArr[0]) {
            var seatObj = element.seats[parseInt(seatSplitArr[1]) - 1];
            if (seatObj) {
              console.log("\n\n\nFount Seat to block: ", seatObj);
              seatObj["status"] = "unavailable";
              this.seatmap[index2]["seats"][parseInt(seatSplitArr[1]) - 1] = seatObj;
              console.log("\n\n\nSeat Obj", seatObj);
              console.log(this.seatmap[index2]["seats"][parseInt(seatSplitArr[1]) - 1]);
              break;
            }

          }
        }

      }
    }

  }

  public formatPayload(): void {
    console.log('SELECTED PASSENGERS :', this.selectedPassengers);
    let seatList: any[] = this.seatConfig;
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

    console.log('SEAT LIST :', seatList);
    this.checkedInPayload.emit({ seatList, flightId: this.fid });
  }

}
