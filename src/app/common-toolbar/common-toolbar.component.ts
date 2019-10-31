import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as AuthActions from './../store/actions/auth.actions';

@Component({
  selector: 'app-common-toolbar',
  templateUrl: './common-toolbar.component.html',
  styleUrls: ['./common-toolbar.component.scss']
})
export class CommonToolbarComponent implements OnInit {

  constructor(private route: Router, private store: Store<AppState>) { }

  ngOnInit() {
  }

  logout() {
    console.log('Activated route :', this.route.url);
    if (this.route.url.startsWith('/staff')) {
       this.store.dispatch(new AuthActions.LoginUpdateUserAction({id: 'staff', isLogin: false}));
    } else if (this.route.url.startsWith('/admin')) {
      this.store.dispatch(new AuthActions.LoginUpdateUserAction({id: 'admin', isLogin: false}));
    }
    localStorage.setItem('isLoggedIn', 'N');
    this.route.navigateByUrl('/login');
  }

}
