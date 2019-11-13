import { Component, Inject, SimpleChanges, EventEmitter, OnInit, OnChanges, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as flights from './../store/reducers/flights.reducers';
import { Observable } from 'rxjs';
import * as FlightActions from './../store/actions/flights.actions';
import { applySourceSpanToStatementIfNeeded } from '@angular/compiler/src/output/output_ast';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  public flightDetails$: Observable<flights.flightState>;
  public flightDetailLoader$: Observable<any>;
  public ancillaryServices: any[] = [];
  public ancillaryServicesFormGroup: FormGroup;
  public selectedAncillaryService: any = '';

  // @Input() fid: string;

  constructor(public dialogRef: MatDialogRef<AddOrDeleteAncillaryServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData, private store: Store<AppState>, private changeDetector: ChangeDetectorRef, private formBuilder: FormBuilder) {

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
        console.log('F-DATA :', fData);
        if (this.dialogData.type === 'ancillary-services') {
          this.ancillaryServices = fData['ancillaryServicesPerFlight'];
        } else if (this.dialogData.type === 'special-meals') {
          this.ancillaryServices = fData['specialMealsPerFlight'];
        } else {
          this.ancillaryServices = fData['shoppingItemsPerFlight'];
        }
      }

      this.changeDetector.markForCheck();

    });

    this.flightDetailLoader$.subscribe((loaderInfo: any) => {
      console.log('loaderInfo :', loaderInfo);
      this.changeDetector.markForCheck();
    });
  }

  public onActionButtonClicked(): void {
    console.log('FORM $$$$ :', this.ancillaryServicesFormGroup);
    if (this.dialogData.action === 'add') {
      console.log('onActionButtonClicked :');
      const addedAncillaryServices: any[] = this.ancillaryServicesFormGroup.value;
      console.log('addedAncillaryServices :', addedAncillaryServices);
      this.dialogRef.close(addedAncillaryServices);
    } else if (this.dialogData.action === 'delete') {
      if (this.selectedAncillaryService) {
        this.dialogRef.close(this.selectedAncillaryService);
      }
    }
  }

  public createItem(label: string, value: boolean): FormGroup {
    return new FormGroup({
      label: new FormControl(label),
      value: new FormControl(value)
    });
  }

  public addItem(ancillaryObject: any): void {
    let control = <FormArray>this.ancillaryServicesFormGroup.controls.ancillaryServiceFormArray;
    control.push(this.createItem(ancillaryObject.label, ancillaryObject.value));
  }

  public addAnotherAncillaryObject(): void {
    this.addItem({ label: '', value: true });
  }

  public onAncillarySelectionChanged(event: any): void {
    console.log('Event :', event);
  }

}
