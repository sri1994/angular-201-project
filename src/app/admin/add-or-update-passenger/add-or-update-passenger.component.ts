import { Component, EventEmitter,  Input, OnChanges, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-or-update-passenger',
  templateUrl: './add-or-update-passenger.component.html',
  styleUrls: ['./add-or-update-passenger.component.scss']
})
export class AddOrUpdatePassengerComponent implements OnChanges {
  
  @Input() selectedPassenger: any;
  @Output() updatedPassengerPayload: EventEmitter<any> = new EventEmitter();

  public passengerFormGroup: FormGroup;

  public constructor() { }

  public ngOnChanges(): void {

    this.setupPassengerForm(this.selectedPassenger.passenger.passport, this.selectedPassenger.passenger.address, this.selectedPassenger.passenger.dateOfBirth);
    
  }

  /**
   * 
   * Sets up passenger form.
   * 
   * @param passport
   * @param address
   * @param dateOfBirth
   *  
   */
  public setupPassengerForm(passport: string = '', address: string = '', dateOfBirth: string = '' ): void {

    this.passengerFormGroup = new FormGroup({
      passport: new FormControl(passport),
      address: new FormControl(address),
      dateOfBirth: new FormControl(dateOfBirth),
    });

  }
  
  /**
   * 
   * Emits updated passenger details to parent component.
   * 
   */
  public submitUpdatedPassengerDetails(): void {

    this.selectedPassenger.passenger.passport = this.passengerFormGroup.get('passport').value;

    this.selectedPassenger.passenger.address = this.passengerFormGroup.get('address').value;

    this.selectedPassenger.passenger.dateOfBirth = this.passengerFormGroup.get('dateOfBirth').value;

    this.updatedPassengerPayload.emit(this.selectedPassenger);

    this.selectedPassenger = '';

  }

}
