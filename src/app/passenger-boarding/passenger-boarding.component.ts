import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './../store/app.states';
import * as AuthActions from './../store/actions/auth.actions';

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, Routes } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'passenger-boarding',
  templateUrl: './passenger-boarding.component.html',
  styleUrls: ['./passenger-boarding.component.scss']
})
export class PassengerBoardingComponent implements OnInit {

  // routeLinks: any[];
  // activeLinkIndex = -1;

  // constructor(private route: Router, private store: Store<AppState>) {
  //   this.routeLinks = [
  //     {
  //       label: 'Check in',
  //       link: '/staff/check-in',
  //       index: 0
  //     }, {
  //       label: 'In flight service',
  //       link: '/staff/in-flight',
  //       index: 1
  //     }
  //   ];
  // }

  // setActiveLinkIndex(i: any) {
  //   this.activeLinkIndex = i;
  //   console.log(this.route.url);
  // }

  // ngOnInit() {
  //   this.route.events.subscribe((res) => {
  //     this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.route.url));
  //   });
  // }

  // logout() {
  //   console.log('Activated route :', this.route.url);
  //   if (this.route.url.startsWith('/staff')) {
  //      this.store.dispatch(new AuthActions.LoginUpdateUserAction({id: 'staff', isLogin: false}));
  //   } else if (this.route.url.startsWith('/admin')) {
  //     this.store.dispatch(new AuthActions.LoginUpdateUserAction({id: 'admin', isLogin: false}));
  //   }
  //   localStorage.setItem('isLoggedIn', 'N');
  //   this.route.navigateByUrl('/login');
  // }

  isViewInitialized = false;
  
  navLinks = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.navLinks = (
      this.route.routeConfig && this.route.routeConfig.children ?
      this.buildNavItems(this.route.routeConfig.children) :
      []
    );
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.changeDetector.detectChanges();
  }

  buildNavItems(routes: Routes) {
    return (routes)
      .filter(route => route.data)
      .map(({ path = '', data }) => ({
        path: path,
        label: data.label,
        icon: data.icon
      }));
  }

  isLinkActive(rla: RouterLinkActive): boolean {
    const routerLink = rla.linksWithHrefs.first;
    
    return this.router.isActive(routerLink.urlTree, false);
  }

}
