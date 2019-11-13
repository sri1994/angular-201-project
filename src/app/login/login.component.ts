import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { User } from './../models/user';

import * as auth from './../store/reducers/auth.reducers';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as AuthActions from './../store/actions/auth.actions';
import { AuthService } from './../auth.service';

import { AuthService as SocialAuthService} from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
 
@Component({
  selector: 'app-log-in',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  public userEmail: any = '';
  public userPassword: any = '';
  public selected: any = 'staff';
  public credentialError: boolean = false;

  userList: Observable<auth.State[]>;
  loading$: Observable<Boolean>;
  error$: Observable<Error>;

  constructor(private store: Store<AppState>, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    localStorage.setItem('isLoggedIn', 'N');
    this.userList = this.store.select(store => store.authState.list);
    // this.loading$ = this.store.select(store => store.authState.loading);
    // this.error$ = this.store.select(store => store.authState.error);

    this.store.dispatch(new AuthActions.LoginUserAction());

    this.userList.subscribe((credentialList: any) => {
      this.authService.credentialList = credentialList;
      console.log('Data :', credentialList);
      this.authService.adminCredential = this.getCredentialObject(credentialList, 'admin');
      console.log('this.authService.adminCredential :', this.authService.adminCredential);
      this.authService.staffCredential = this.getCredentialObject(credentialList, 'staff');
      console.log('this.authService.staffCredential :', this.authService.staffCredential);
    });

    // this.socialAuthService.authState.subscribe((user: any) => {
    //   console.log('SOCIAL MEDIA USER :', user);
    // })
  }

  private getCredentialObject(credentialList: any[], objType: any): any {
    if (credentialList && credentialList.length > 0) {
      return credentialList.filter((credential: any) => {
        console.log('Credential :', credential);
        return credential.userType === objType
      });
    } else {
      return [];
    }
  }

  onSubmit(): void {
    console.log(this.userEmail, '', this.userPassword, '', this.selected);
    if (this.authService.adminCredential.length > 0 || this.authService.staffCredential.length > 0) {
      if (this.selected === 'admin') {
        if (this.userEmail === this.authService.adminCredential[0].user.email && this.userPassword === this.authService.adminCredential[0].user.password) {
          this.store.dispatch(new AuthActions.LoginUpdateUserAction({ id: 'admin', isLogin: true }));
          this.router.navigateByUrl('/admin/admin-dashboard');
          this.credentialError = false;
        } else {
          this.credentialError = true;
        }
      }
      else if (this.selected === 'staff') {
        if (this.userEmail === this.authService.staffCredential[0].user.email && this.userPassword === this.authService.staffCredential[0].user.password) {
          this.store.dispatch(new AuthActions.LoginUpdateUserAction({ id: 'staff', isLogin: true}));
          this.router.navigateByUrl('/staff/passenger-boarding');
          this.credentialError = false;
        } else {
          this.credentialError = true;
        }
      }
    }
  }

  // signInWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }
 
  // signInWithFB(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // } 
 
  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }

}
