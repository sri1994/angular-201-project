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
  declarations: [PassengerBoardingComponent, InFlightComponent, CheckinComponent, SeatMapComponent, ActionModalComponent, PassengersListComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ActionModalComponent]
})
export class StaffModule { }