import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './../../store/app.states';
import * as AuthActions from './../../store/actions/auth.actions';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-common-toolbar',
  templateUrl: './common-toolbar.component.html',
  styleUrls: ['./common-toolbar.component.scss']
})

export class CommonToolbarComponent implements OnInit {

  @Input() userData: any;

  public isMobile: boolean;
  public isTablet: boolean;
  public isDesktopDevice: boolean;

  public constructor(private breakpointObserver: BreakpointObserver, private route: Router, private store: Store<AppState>, private deviceService: DeviceDetectorService) {

    this.isMobile = this.deviceService.isMobile();

    this.isTablet = this.deviceService.isTablet();

    this.isDesktopDevice = this.deviceService.isDesktop();

  }

  public ngOnInit(): void {

    console.log('USERDATA :', this.userData);

    this.breakpointObserver.observe([
      '(max-width: 580px)'
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  public logout() {

    if (this.route.url.startsWith('/staff')) {

      this.store.dispatch(new AuthActions.LoginUpdateUserAction({ id: 'staff', isLogin: false }));

    } else if (this.route.url.startsWith('/admin')) {

      this.store.dispatch(new AuthActions.LoginUpdateUserAction({ id: 'admin', isLogin: false }));

    }

    localStorage.setItem('isLoggedIn', 'N');

    this.route.navigateByUrl('/login');

  }

}
