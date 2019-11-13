import { Component, SimpleChanges, EventEmitter, OnInit, OnChanges, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as flights from './../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import * as FlightActions from './../store/actions/flights.actions';
import { applySourceSpanToStatementIfNeeded } from '@angular/compiler/src/output/output_ast';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddInflightShoppingConfirmModalComponent } from '../add-inflight-shopping-confirm-modal/add-inflight-shopping-confirm-modal.component';

export interface inFlightDialogData {
  selectedState: string;
  passenger: any;
}

@Component({
  selector: 'app-add-inflight-shopping-request',
  templateUrl: './add-inflight-shopping-request.component.html',
  styleUrls: ['./add-inflight-shopping-request.component.scss']
})
export class AddInflightShoppingRequestComponent implements OnInit {

  @Input() fid: string;

  @Output() addShoppingRequestChangePayload: EventEmitter<any> = new EventEmitter();

  public seatConfig: any[] = [];
  public seatmap: any[] = [];
  public isShowSeatLayout: boolean = false;
  public isShowFlightDetail: boolean = false;
  public flightDetails: any = '';
  public isEditSeatLayout: boolean = false;
  public isSeatLayoutLoading: boolean = true;

  public passengerList: any[] = [];
  public selectedPassenger: any = '';
  public ancillaryFormArray: FormArray;
  public isPassengersLoading: boolean = false;
  public isEditAncillaryServices: boolean = false;
  public inFlightShoppingAction: any = '';

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

  public ancillaryForm: FormGroup;

  public selectedPassengers: any[] = [];

  title = 'seat-chart-generator';

  public flightDetails$: Observable<flights.flightState>;
  public flightDetailLoader$: Observable<any>;

  constructor(private store: Store<AppState>, private changeDetector: ChangeDetectorRef, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.flightDetails$ = this.store.select(store => store.flightState.flightData);
    this.flightDetailLoader$ = this.store.select(store => store.flightState.loading);
    this.store.dispatch(new FlightActions.GetFlightDetailsAction(this.fid));
    this.flightDetails$.subscribe(fData => {
      this.isEditAncillaryServices = false;
      // this.changeDetector.detectChanges();
      this.flightDetails = fData;
      this.seatConfig = fData['seatConfig'];
      console.log('fData in flightDetails$ :', fData['seatConfig']);
      if (this.seatConfig) {
        this.isSeatLayoutLoading = false;
        this.isEditSeatLayout = false;
        this.getPassengerList(this.seatConfig);
        this.changeDetector.markForCheck();
      }
    });

    this.flightDetailLoader$.subscribe((loaderInfo: any) => {
      console.log('loaderInfo :', loaderInfo);
      this.isPassengersLoading = loaderInfo;
    });

    // this.seatConfigData.subscribe((fData: any) => {
    //   console.log('fData :', fData);
    //   this.seatConfig = fData.seatConfig;
    //   this.processSeatChart(this.seatConfig);
    // })
  }

  public getPassengerList(seatConfig: any[]): void {
    this.passengerList = [];
    console.log('SEATCONFIG :', seatConfig);
    if (seatConfig.length > 0) {
      seatConfig[0].seats.forEach((seatInfo: any) => {
        const passengerObj: any = {
          passenger: seatInfo.passengerDetails,
          seatNo: seatInfo.serialNo
        }
        this.passengerList.push(passengerObj);
      })
    }
  }

  public onPassengerSelectionChanged(selectedPass: any): void {
    console.log('Selected passenger :', this.selectedPassenger);
    // let control = <FormArray>this.ancillaryForm.controls.ancillaryList;
    // control.clear();
    // this.selectedPassenger.passenger.ancillaryServices.forEach((anciService: any) => {
    //   this.addItem(anciService);
    // });
  }

  public openInFlightDialog(inFlightShoppingState: string): void {
    console.log('inFlightShoppingState :', inFlightShoppingState);
    this.inFlightShoppingAction = inFlightShoppingState;
    const sampleData: inFlightDialogData = { selectedState: inFlightShoppingState, passenger: this.selectedPassenger.passenger };
    const dialogRef = this.dialog.open(AddInflightShoppingConfirmModalComponent, {
      width: '30rem',
      data: sampleData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      console.log('Result :', result);
      this.formatPayload(result);
    });
  }

  private formatPayload(result: any): void {
    if (result) {
      let seatList: any[] = this.seatConfig;
      seatList[0].seats.forEach((seat: any, index: any) => {
        if (seat.serialNo === this.selectedPassenger.seatNo) {
          seatList[0].seats[index].passengerDetails.isEntitledToInFlightShopping = this.inFlightShoppingAction === 'ADD' && result === 'yes' ? true : false;
          return false;
        } else {
          return true;
        }
      });

      console.log('SEAT LIST :', seatList);
      this.addShoppingRequestChangePayload.emit({ seatList, flightId: this.fid });
    }

  }

}
