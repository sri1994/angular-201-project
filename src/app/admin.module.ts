import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './shared.module';

const routes: Routes = [
  { path: 'admin-dashboard', component: AdminDashboardComponent }
];


@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
