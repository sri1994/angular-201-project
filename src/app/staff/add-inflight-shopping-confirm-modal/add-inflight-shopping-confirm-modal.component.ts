import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  selectedState: string;
  passenger: any;
}

@Component({
  selector: 'app-add-inflight-shopping-confirm-modal',
  templateUrl: './add-inflight-shopping-confirm-modal.component.html',
  styleUrls: ['./add-inflight-shopping-confirm-modal.component.scss']
})

export class AddInflightShoppingConfirmModalComponent {

  public constructor(
    public dialogRef: MatDialogRef<AddInflightShoppingConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {}

  public onClickAction(action: any): void {

    if (action === 'yes') {

      this.dialogRef.close('yes');

    } else {

      this.dialogRef.close();

    }
    
  }

}
