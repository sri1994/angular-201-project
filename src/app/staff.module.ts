import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { PassengerBoardingComponent } from './passenger-boarding/passenger-boarding.component';
import { InFlightComponent } from './in-flight/in-flight.component';
import { SharedModule } from './shared.module';

import { Routes, RouterModule } from '@angular/router';
import { CheckinComponent } from './checkin/checkin.component';
import { SeatMapComponent } from './seat-map/seat-map.component';
import { ActionModalComponent } from './action-modal/action-modal.component';
import { PassengersListComponent } from './passengers-list/passengers-list.component';
import { ModifySpecialMealComponent } from './modify-special-meal/modify-special-meal.component';
import { ModifyAncillaryServicesComponent } from './modify-ancillary-services/modify-ancillary-services.component';
import { AddInflightShoppingRequestComponent } from './add-inflight-shopping-request/add-inflight-shopping-request.component';
import { AddInflightShoppingConfirmModalComponent } from './add-inflight-shopping-confirm-modal/add-inflight-shopping-confirm-modal.component';

const routes: Routes = [
  // { path: '', redirectTo: '/check-in', pathMatch: 'full' },
  { path: 'passenger-boarding', component: PassengerBoardingComponent, children: [
    { path: '', redirectTo: 'check-in' },
    { path: 'check-in', component: CheckinComponent, data: { label: 'Check in' } },
    { path: 'in-flight', component: InFlightComponent, data: { label: 'In flight service' } }
  ] },
  // { path: 'check-in', component: CheckinComponent },
  // { path: 'in-flight', component: InFlightComponent },
  // { path: '**', redirectTo: '/staff/check-in'}
];

@NgModule({
  declarations: [PassengerBoardingComponent, InFlightComponent, CheckinComponent, SeatMapComponent, ModifySpecialMealComponent, ModifyAncillaryServicesComponent, AddInflightShoppingRequestComponent, AddInflightShoppingConfirmModalComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ActionModalComponent, AddInflightShoppingConfirmModalComponent]
})
export class StaffModule { }
