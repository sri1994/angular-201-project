/** -- Angular imports -- */
import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';

/** -- Store imports -- */
import { Store } from '@ngrx/store';

/** Rxjs imports */
import { Observable } from 'rxjs';

/** -- Shared -- */
import { AppState } from './../../store/app.states';
import * as flights from './../../store/reducers/flights.reducers';
import * as FlightActions from './../../store/actions/flights.actions';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  action: string;
  type: string;
  fId: string;
}

@Component({
  selector: 'app-add-or-delete-ancillary-service',
  templateUrl: './add-or-delete-ancillary-service.component.html',
  styleUrls: ['./add-or-delete-ancillary-service.component.scss']
})

export class AddOrDeleteAncillaryServiceComponent implements OnInit {
  
  public ancillaryServices: any[] = [];

  public ancillaryServicesFormGroup: FormGroup;

  public flightDetails$: Observable<flights.FlightState>;

  public flightDetailLoader$: Observable<any>;

  public selectedAncillaryService: any = '';

  public constructor(public dialogRef: MatDialogRef<AddOrDeleteAncillaryServiceComponent>,
                     @Inject(MAT_DIALOG_DATA) public dialogData: DialogData, private store: Store<AppState>,
                     private changeDetector: ChangeDetectorRef, private formBuilder: FormBuilder) {

    this.ancillaryServicesFormGroup = this.formBuilder.group({
      ancillaryServiceFormArray: this.formBuilder.array([])
    });

  }

  public ngOnInit(): void {

    this.addAnotherAncillaryObject();

    this.flightDetails$ = this.store.select(store => store.flightState.flightData);

    this.flightDetailLoader$ = this.store.select(store => store.flightState.loading);

    this.store.dispatch(new FlightActions.GetFlightDetailsAction(this.dialogData.fId));

    this.flightDetails$.subscribe((fData: any) => {

      if (fData) {

        if (this.dialogData.type === 'ancillary-services') {

          this.ancillaryServices = fData.ancillaryServicesPerFlight;

        } else if (this.dialogData.type === 'special-meals') {

          this.ancillaryServices = fData.specialMealsPerFlight;

        } else {

          this.ancillaryServices = fData.shoppingItemsPerFlight;

        }

      }

      this.changeDetector.markForCheck();

    });

    this.flightDetailLoader$.subscribe(() => {

      this.changeDetector.markForCheck();

    });
  }
  
  /**
   * 
   * Sends output generated on action button click to parent comp.
   * 
   */
  public onActionButtonClicked(): void {

    if (this.dialogData.action === 'add') {

      const addedAncillaryServices: any[] = this.ancillaryServicesFormGroup.value;

      this.dialogRef.close(addedAncillaryServices);

    } else if (this.dialogData.action === 'delete') {

      if (this.selectedAncillaryService) {

        this.dialogRef.close(this.selectedAncillaryService);

      }

    }

  }
  
  /**
   * 
   * Creates form group in a form array.
   * 
   * @param label - label control.
   * @param value - value control.
   *  
   */
  public createItem(label: string, value: boolean): FormGroup {

    return new FormGroup({
      label: new FormControl(label),
      value: new FormControl(value)
    });

  }
  
  /**
   * 
   * Adds formgroup into form array.
   * 
   * @param ancillaryObject
   * 
   */
  public addItem(ancillaryObject: any): void {

    const control = this.ancillaryServicesFormGroup.controls.ancillaryServiceFormArray as FormArray;

    control.push(this.createItem(ancillaryObject.label, ancillaryObject.value));

  }
  
  /**
   * 
   * Adds another ancillary object if user clicks plus icon.
   * 
   */
  public addAnotherAncillaryObject(): void {

    this.addItem({ label: '', value: true });

  }

}
