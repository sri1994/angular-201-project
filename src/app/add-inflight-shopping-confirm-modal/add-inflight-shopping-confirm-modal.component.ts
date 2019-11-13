import { Component, OnInit, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  selectedState: string;
  passenger: any;
}
@Component({
  selector: 'app-add-inflight-shopping-confirm-modal',
  templateUrl: './add-inflight-shopping-confirm-modal.component.html',
  styleUrls: ['./add-inflight-shopping-confirm-modal.component.scss']
})
export class AddInflightShoppingConfirmModalComponent implements OnInit {

  ngOnInit() {
    console.log('dialogData :', this.dialogData);
  }

  constructor(
    public dialogRef: MatDialogRef<AddInflightShoppingConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {}

  onClickAction(action: any): void {
    if (action === 'yes') {
      this.dialogRef.close('yes');
    } else {
      this.dialogRef.close();
    }
  }

}
