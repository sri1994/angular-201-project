import { Component, SimpleChanges, EventEmitter, OnInit, OnChanges, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as flights from './../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import * as FlightActions from './../store/actions/flights.actions';
import { applySourceSpanToStatementIfNeeded } from '@angular/compiler/src/output/output_ast';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-modify-ancillary-services',
  templateUrl: './modify-ancillary-services.component.html',
  styleUrls: ['./modify-ancillary-services.component.scss']
})
export class ModifyAncillaryServicesComponent implements OnInit {

  @Input() fid: string;

  @Output() ancillaryChangePayload: EventEmitter<any> = new EventEmitter();

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

  constructor(private store: Store<AppState>, private changeDetector: ChangeDetectorRef, private formBuilder: FormBuilder) {

    this.ancillaryForm = this.formBuilder.group({
      ancillaryList: this.formBuilder.array([])
    });

    // this.createItem('Airport parking', true)

  }

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

  public createItem(label: string, status: boolean): FormGroup {
    return new FormGroup({
      label: new FormControl(label),
      status: new FormControl(status)
    });
  }

  public addItem(ancillaryObject: any): void {
    let control = <FormArray>this.ancillaryForm.controls.ancillaryList;
    control.push(this.createItem(ancillaryObject.label, ancillaryObject.status));
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
    let control = <FormArray>this.ancillaryForm.controls.ancillaryList;
    control.clear();
    this.selectedPassenger.passenger.ancillaryServices.forEach((anciService: any) => {
      this.addItem(anciService);
    });
  }

  public editAncillaryServices(): void {
    this.isEditAncillaryServices = true;
  }

  public modifyAncillaryServices(): void {
    console.log('FORM modifyAncillaryServices :', this.ancillaryForm.get('ancillaryList').value);
    this.formatPayload();
    this.isEditAncillaryServices = false;
  }

  public onAncillaryServicesChanged(event: Event): void {
    if (this.isEditAncillaryServices) {
      console.log('FORM :', this.ancillaryForm.get('ancillaryList').value);
    } else {
      event.preventDefault();
    }
  }

  public formatPayload(): void {
    console.log('SELECTED PASSENGERS :', this.selectedPassengers);
    let seatList: any[] = this.seatConfig;
    seatList[0].seats.forEach((seat: any, index: any) => {
      if (seat.serialNo === this.selectedPassenger.seatNo) {
        seatList[0].seats[index].passengerDetails.ancillaryServices = this.ancillaryForm.get('ancillaryList').value;
        return false;
      } else {
        return true;
      }
    });

    console.log('SEAT LIST :', seatList);
    this.ancillaryChangePayload.emit({ seatList, flightId: this.fid });
  }

}
