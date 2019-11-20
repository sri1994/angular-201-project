import { Component, SimpleChanges, EventEmitter, OnInit, OnChanges, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../../store/app.states';
import * as flights from './../../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import * as FlightActions from './../../store/actions/flights.actions';
import { FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddInflightShoppingConfirmModalComponent } from '../add-inflight-shopping-confirm-modal/add-inflight-shopping-confirm-modal.component';

export interface InFlightDialogData {
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
  public isShowSeatLayout = false;
  public isShowFlightDetail = false;
  public flightDetails: any = '';
  public isEditSeatLayout = false;
  public isSeatLayoutLoading = true;
  public passengerList: any[] = [];
  public selectedPassenger: any = '';
  public ancillaryFormArray: FormArray;
  public isPassengersLoading = false;
  public isEditAncillaryServices = false;
  public inFlightShoppingAction: any = '';
  public ancillaryForm: FormGroup;
  public selectedPassengers: any[] = [];
  public flightDetails$: Observable<flights.FlightState>;
  public flightDetailLoader$: Observable<any>;

  public constructor(private store: Store<AppState>, private changeDetector: ChangeDetectorRef, public dialog: MatDialog) { }

  public ngOnInit(): void {

    this.flightDetails$ = this.store.select(store => store.flightState.flightData);

    this.flightDetailLoader$ = this.store.select(store => store.flightState.loading);

    this.store.dispatch(new FlightActions.GetFlightDetailsAction(this.fid));

    this.flightDetails$.subscribe((fData: any) => {

      this.isEditAncillaryServices = false;

      this.flightDetails = fData;

      this.seatConfig = fData.seatConfig;

      if (this.seatConfig) {

        this.isSeatLayoutLoading = false;

        this.isEditSeatLayout = false;

        this.getPassengerList(this.seatConfig);

        this.changeDetector.markForCheck();

      }

    });

    this.flightDetailLoader$.subscribe((loaderInfo: any) => {

      this.isPassengersLoading = loaderInfo;

    });

  }
  
  /**
   * 
   * Gets passenger list.
   * 
   * @param seatConfig
   * 
   */
  public getPassengerList(seatConfig: any[]): void {

    this.passengerList = [];

    if (seatConfig.length > 0) {

      seatConfig[0].seats.forEach((seatInfo: any) => {

        const passengerObj: any = {
          passenger: seatInfo.passengerDetails,
          seatNo: seatInfo.serialNo
        };
        
        this.passengerList.push(passengerObj);

      });

    }

  }
  
  /**
   * 
   * Opens in flight dialog.
   * 
   * @param inFlightShoppingState.
   * 
   */
  public openInFlightDialog(inFlightShoppingState: string): void {

    this.inFlightShoppingAction = inFlightShoppingState;

    const sampleData: InFlightDialogData = { selectedState: inFlightShoppingState, passenger: this.selectedPassenger.passenger };
    
    const dialogRef = this.dialog.open(AddInflightShoppingConfirmModalComponent, {
      width: '30rem',
      data: sampleData
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      this.formatPayload(result);

    });

  }
  
  /**
   * 
   * Formats payload.
   * 
   * @param result
   * 
   */
  private formatPayload(result: any): void {

    if (result) {

      const seatList: any[] = this.seatConfig;

      seatList[0].seats.forEach((seat: any, index: any) => {

        if (seat.serialNo === this.selectedPassenger.seatNo) {

          seatList[0].seats[index].passengerDetails.isEntitledToInFlightShopping = this.inFlightShoppingAction === 'ADD' && result === 'yes' ? true : false;
          
          return false;

        } else {

          return true;

        }

      });

      this.addShoppingRequestChangePayload.emit({ seatList, flightId: this.fid });

    }

  }

}
