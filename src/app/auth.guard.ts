import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServices } from './auth.service';
import * as auth from './store/reducers/auth.reducers';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.states';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public userList: Observable<auth.State[]>;

  constructor(private authService: AuthServices, private myRoute: Router, private store: Store<AppState>) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.myRoute.navigate(['login']);
      return false;
    }

  }

}
