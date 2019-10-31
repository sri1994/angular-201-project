import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'staff', loadChildren: './staff.module#StaffModule', canActivate: 
  [AuthGuard]},
  { path: 'admin', loadChildren: './admin.module#AdminModule', canActivate: 
  [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
