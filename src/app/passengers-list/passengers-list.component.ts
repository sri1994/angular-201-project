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
}

@Component({
  selector: 'app-passengers-list',
  templateUrl: './passengers-list.component.html',
  styleUrls: ['./passengers-list.component.scss']
})
export class PassengersListComponent implements OnInit {

  @Input() flightId: string;

  public displayedColumns = ['Name', 'Seat', 'AncillaryServices'];
  public dataSource: MatTableDataSource<PassengerData>;
  public passengers: PassengerData[];

  public passengerStatusList: any[];
  public selectedStatus: any;
  public flightDetails$: Observable<flights.flightState>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public constructor(private store: Store<AppState>) {

    this.selectedStatus = '';

    this.passengerStatusList = [ 'Checked in', 'Not checked in', 'With infant', 'Require wheel chair'];

    this.passengers = [
      {
        name: 'Srinivas Prasad',
        seatNo: '31',
        status: {
          checkedIn: true,
          withInfant: true,
          wheelChair: false
        },
        ancillaryServices: [
          'airportParking',
          'currencyExchange'
        ]
      },
      {
        name: 'Srinivas Prasad H R',
        seatNo: '32',
        status: {
          checkedIn: true,
          withInfant: true,
          wheelChair: false
        },
        ancillaryServices: [
          'airportParking',
          'currencyExchange'
        ]
      },
      {
        name: 'Subramanya Prasad H R',
        seatNo: '32',
        status: {
          checkedIn: true,
          withInfant: false,
          wheelChair: false
        },
        ancillaryServices: [
          'airportParking',
          'currencyExchange'
        ]
      },
      {
        name: 'Stephen Hawking',
        seatNo: '34',
        status: {
          checkedIn: true,
          withInfant: false,
          wheelChair: true
        },
        ancillaryServices: [
          'airportParking',
          'currencyExchange',
          'hotelBooking'
        ]
      }
    ];

  }

  public ngOnInit() {

    this.flightDetails$ = this.store.select(store => store.flightState.flightData);
    this.store.dispatch(new FlightActions.GetFlightDetailsAction(this.flightId));

    // if (this.passengerList && this.passengerList.length) {
    //   this.passengers = this.passengerList;
    // }
    this.flightDetails$.subscribe((flightDetail: any) => {
      console.log('FLIGHT DETAILS :', flightDetail);
    })
    this.dataSource = new MatTableDataSource(this.passengers);
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  public onStatusChange(changedStatus: any): void {
    console.log('ChangedStatus :', changedStatus);
    let filterPassengersList: PassengerData[];
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
    } else {
      filterPassengersList = this.passengers.filter((passenger: any) => {
        return !(passenger.status.checkedIn);
      });
      this.dataSource = new MatTableDataSource(filterPassengersList);
    }
  }
}
