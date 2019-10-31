import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { User } from './models/user';

import * as auth from './store/reducers/auth.reducers';

import { Store } from '@ngrx/store';
import { AppState } from './store/app.states';
import * as AuthActions from './store/actions/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public userList: Observable<auth.State[]>;

  constructor(private auth: AuthService, private myRoute: Router, private store: Store<AppState>) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.myRoute.navigate(["login"]);
      return false;
    }

  }

}
