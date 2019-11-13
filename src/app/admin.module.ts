import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './shared.module';
import { AddOrUpdatePassengerComponent } from './add-or-update-passenger/add-or-update-passenger.component';
import { ActionModalComponent } from './action-modal/action-modal.component';
import { AddOrDeleteAncillaryServiceComponent } from './add-or-delete-ancillary-service/add-or-delete-ancillary-service.component';

const routes: Routes = [
  { path: 'admin-dashboard', component: AdminDashboardComponent }
];


@NgModule({
  declarations: [AdminDashboardComponent, AddOrUpdatePassengerComponent, AddOrDeleteAncillaryServiceComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ActionModalComponent, AddOrDeleteAncillaryServiceComponent]
})
export class AdminModule { }
