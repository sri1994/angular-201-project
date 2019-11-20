import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as auth from './../store/reducers/auth.reducers';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as AuthActions from './../store/actions/auth.actions';
import { AuthServices } from './../auth.service';
import { GoogleLoginProvider } from 'angular-6-social-login';
import { AuthService as SocialAuthService } from 'angular-6-social-login';

@Component({
  selector: 'app-log-in',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public userEmail: any = '';
  public userPassword: any = '';
  public selected: any = 'staff';
  public credentialError = false;

  userList: Observable<auth.State[]>;
  loading$: Observable<boolean>;
  error$: Observable<Error>;
  public isShowEmailForm = false;

  public constructor(private store: Store<AppState>,
                     private authServices: AuthServices,
                     private socialAuthService: SocialAuthService,
                     private router: Router) {
  }

  public ngOnInit(): void {

    localStorage.setItem('isLoggedIn', 'N');

    this.userList = this.store.select(store => store.authState.list);

    this.store.dispatch(new AuthActions.LoginUserAction());

    this.userList.subscribe((credentialList: any) => {

      this.authServices.credentialList = credentialList;

      this.authServices.adminCredential = this.getCredentialObject(credentialList, 'admin');

      this.authServices.staffCredential = this.getCredentialObject(credentialList, 'staff');

    });

  }
  
  /**
   * 
   * Shows login form.
   * 
   */
  public showLoginForm(): void {

    this.isShowEmailForm = true;

  }
  
  /**
   * 
   * Executes on click of Google sign in.
   * 
   * @param socialPlatform
   * 
   */
  public socialSignIn(socialPlatform: string) {

    this.isShowEmailForm = false;

    let socialPlatformProvider: any;

    if (socialPlatform === 'google') {

      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;

    }

    this.socialAuthService
      .signIn(socialPlatformProvider)
      .then(userData => {

        const googleUserData: any = userData;

        googleUserData.type = 'google';

        this.router.navigate(['/staff/passenger-boarding', googleUserData]);

        localStorage.setItem('isLoggedIn', 'Y');

      })
      .catch(err => {
        console.log('Error :', err);
      });
  }
  
  /**
   * 
   * Signs out of social account.
   * 
   */
  public socialSignOut() {

    this.socialAuthService.signOut().then(data => {
      console.log('data :', data);
      sessionStorage.clear();
    });

  }
  
  /**
   * 
   * Gets credential object.
   * 
   * @param credentialList 
   * @param objType
   * 
   */
  private getCredentialObject(credentialList: any[], objType: any): any {

    if (credentialList && credentialList.length > 0) {

      return credentialList.filter((credential: any) => {

        return credential.userType === objType;

      });

    } else {

      return [];

    }

  }
  
  /**
   * 
   * On submit.
   * 
   */
  public onSubmit(): void {

    if (this.authServices.adminCredential.length > 0 || this.authServices.staffCredential.length > 0) {

      if (this.selected === 'admin') {

        if (this.userEmail === this.authServices.adminCredential[0].user.email && this.userPassword === this.authServices.adminCredential[0].user.password) {
          
          this.store.dispatch(new AuthActions.LoginUpdateUserAction({ id: 'admin', isLogin: true }));
          
          this.router.navigate(['/admin/admin-dashboard', { type: 'email'}]);
          
          this.credentialError = false;

        } else {

          this.credentialError = true;

        }

      } else if (this.selected === 'staff') {

        if (this.userEmail === this.authServices.staffCredential[0].user.email && this.userPassword === this.authServices.staffCredential[0].user.password) {
          
          this.store.dispatch(new AuthActions.LoginUpdateUserAction({ id: 'staff', isLogin: true }));
          
          this.router.navigate(['/staff/passenger-boarding', { type: 'email'}]);
          
          this.credentialError = false;

        } else {

          this.credentialError = true;

        }

      }

    }

  }

}
