import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTab } from '@angular/material';
import { AncillaryServices } from './../custom-enums/ancillary-services.enum';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as flights from './../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import * as FlightActions from './../store/actions/flights.actions';

export interface PassengerData {
  name: string;
  seatNo: string;
  status: {
    checkedIn: boolean;
    withInfant: boolean;
    wheelChair: boolean;
  },
  ancillaryServices: any[];
  passport: string;
  address: string;
  dateOfBirth: string;
}

@Component({
  selector: 'app-passengers-list',
  templateUrl: './passengers-list.component.html',
  styleUrls: ['./passengers-list.component.scss']
})
export class PassengersListComponent implements OnInit {

  @Input() flightId: string;
  @Input() fromStaff: boolean;

  public displayedColumns = ['Name', 'Seat', 'AncillaryServices'];
  public dataSource: MatTableDataSource<PassengerData>;
  public passengers: PassengerData[] = [];

  public passengerStatusList: any[];
  public selectedStatus: any;
  public flightDetails$: Observable<flights.flightState>;

  flightDetail: any = '';

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public constructor(private store: Store<AppState>) {

    this.selectedStatus = '';

    // this.passengers = [
    //   {
    //     name: 'Srinivas Prasad',
    //     seatNo: '31',
    //     status: {
    //       checkedIn: true,
    //       withInfant: true,
    //       wheelChair: false
    //     },
    //     ancillaryServices: [
    //       'airportParking',
    //       'currencyExchange'
    //     ]
    //   },
    //   {
    //     name: 'Srinivas Prasad H R',
    //     seatNo: '32',
    //     status: {
    //       checkedIn: true,
    //       withInfant: true,
    //       wheelChair: false
    //     },
    //     ancillaryServices: [
    //       'airportParking',
    //       'currencyExchange'
    //     ]
    //   },
    //   {
    //     name: 'Subramanya Prasad H R',
    //     seatNo: '32',
    //     status: {
    //       checkedIn: true,
    //       withInfant: false,
    //       wheelChair: false
    //     },
    //     ancillaryServices: [
    //       'airportParking',
    //       'currencyExchange'
    //     ]
    //   },
    //   {
    //     name: 'Stephen Hawking',
    //     seatNo: '34',
    //     status: {
    //       checkedIn: true,
    //       withInfant: false,
    //       wheelChair: true
    //     },
    //     ancillaryServices: [
    //       'airportParking',
    //       'currencyExchange',
    //       'hotelBooking'
    //     ]
    //   }
    // ];

  }

  public ngOnInit() {

    if (this.fromStaff) {
      this.passengerStatusList = ['Checked in', 'Not checked in', 'With infant', 'Require wheel chair', 'None'];
    } else {
      this.passengerStatusList = ['Passport', 'Address', 'DateOfBirth', 'None'];
    }

    //this.flightDetails$ = this.store.select(store => store.flightState.flightData);
    this.flightDetails$ = this.store.select(store => store.flightState.flightData);
    this.store.dispatch(new FlightActions.GetFlightDetailsAction(this.flightId));

    // if (this.passengerList && this.passengerList.length) {
    //   this.passengers = this.passengerList;
    // }
    this.flightDetails$.subscribe((flightDetail: any) => {
      console.log('FLIGHT DETAILS $$$ :', flightDetail);
      this.flightDetail = flightDetail;

      this.passengers = [];

      if (this.flightDetail && this.flightDetail['seatConfig']) {

        this.flightDetail.seatConfig[0].seats.forEach(seat => {

          let passenger: any = {};
          passenger['seatNo'] = seat.serialNo;
          passenger['name'] = seat.passengerDetails.name;
          passenger['status'] = seat.status;
          passenger['ancillaryServices'] = seat.passengerDetails.ancillaryServices;
          passenger['dateOfBirth'] = seat.passengerDetails.dateOfBirth;
          passenger['passport'] = seat.passengerDetails.passport;
          passenger['address'] = seat.passengerDetails.address;
          this.passengers.push(passenger);
        });

      }
      this.dataSource = new MatTableDataSource(this.passengers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  public onStatusChange(changedStatus: any): void {
    console.log('ChangedStatus :', changedStatus);
    let filterPassengersList: PassengerData[];

    if (this.fromStaff) {
      if (changedStatus.value === 'With infant') {
        filterPassengersList = this.passengers.filter((passenger: any) => {
          return passenger.status.withInfant;
        });
        this.dataSource = new MatTableDataSource(filterPassengersList);
      } else if (changedStatus.value === 'Require wheel chair') {
        filterPassengersList = this.passengers.filter((passenger: any) => {
          return passenger.status.wheelChair;
        });
        this.dataSource = new MatTableDataSource(filterPassengersList);
      } else if (changedStatus.value === 'Checked in') {
        filterPassengersList = this.passengers.filter((passenger: any) => {
          return passenger.status.checkedIn;
        });
        this.dataSource = new MatTableDataSource(filterPassengersList);
      } else if (changedStatus.value === 'Not checked in') {
        filterPassengersList = this.passengers.filter((passenger: any) => {
          return !(passenger.status.checkedIn);
        });
        this.dataSource = new MatTableDataSource(filterPassengersList);
      } else {
        this.dataSource = new MatTableDataSource(this.passengers);
      }
    } else {
      if (changedStatus.value === 'Passport') {
        filterPassengersList = this.passengers.filter((passenger: any) => {
          return !(passenger.passport);
        });
      } else if (changedStatus.value === 'Address') {
        filterPassengersList = this.passengers.filter((passenger: any) => {
          return !(passenger.address);
        });
      } else if (changedStatus.value === 'DateOfBirth') {
        filterPassengersList = this.passengers.filter((passenger: any) => {
          return !(passenger.dateOfBirth);
        });
      } else {
        filterPassengersList = this.passengers;
      }
      this.dataSource = new MatTableDataSource(filterPassengersList);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
