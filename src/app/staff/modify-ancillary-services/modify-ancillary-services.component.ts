import { Component, EventEmitter, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../../store/app.states';
import * as flights from './../../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import * as FlightActions from './../../store/actions/flights.actions';
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
  public ancillaryForm: FormGroup;
  public selectedPassengers: any[] = [];
  public flightDetails$: Observable<flights.FlightState>;
  public flightDetailLoader$: Observable<any>;

  public constructor(private store: Store<AppState>, private changeDetector: ChangeDetectorRef, private formBuilder: FormBuilder) {

    this.ancillaryForm = this.formBuilder.group({
      ancillaryList: this.formBuilder.array([])
    });

  }

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
   * Creates form group item.
   * 
   * @param label
   * @param status
   * 
   */
  public createItem(label: string, status: boolean): FormGroup {

    return new FormGroup({
      label: new FormControl(label),
      status: new FormControl(status)
    });

  }
  
  /**
   * 
   * Adds formgroup item to form array.
   * 
   * @param ancillaryObject
   * 
   */
  public addItem(ancillaryObject: any): void {

    const control = this.ancillaryForm.controls.ancillaryList as FormArray;

    control.push(this.createItem(ancillaryObject.label, ancillaryObject.status));

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

  public onPassengerSelectionChanged(selectedPass: any): void {

    console.log('Selected passenger :', selectedPass);

    const control = this.ancillaryForm.controls.ancillaryList as FormArray;

    control.clear();

    this.selectedPassenger.passenger.ancillaryServices.forEach((anciService: any) => {
      this.addItem(anciService);
    });

  }
  
  /**
   * 
   * Edits ancillary services.
   * 
   */
  public editAncillaryServices(): void {

    this.isEditAncillaryServices = true;

  }
  
  /**
   * 
   * Modifies ancillary services.
   * 
   */
  public modifyAncillaryServices(): void {

    this.formatPayload();

    this.isEditAncillaryServices = false;

  }
  
  /**
   * 
   * On ancillary services changed.
   * 
   * @param event
   * 
   */
  public onAncillaryServicesChanged(event: Event): void {

    if (this.isEditAncillaryServices) {

      console.log('FORM :', this.ancillaryForm.get('ancillaryList').value);

    } else {

      event.preventDefault();

    }

  }
  
  /**
   * 
   * Formats payload.
   * 
   */
  public formatPayload(): void {
    
    const seatList: any[] = this.seatConfig;

    seatList[0].seats.forEach((seat: any, index: any) => {

      if (seat.serialNo === this.selectedPassenger.seatNo) {

        seatList[0].seats[index].passengerDetails.ancillaryServices = this.ancillaryForm.get('ancillaryList').value;
        
        return false;

      } else {

        return true;

      }

    });

    this.ancillaryChangePayload.emit({ seatList, flightId: this.fid });

  }

}
