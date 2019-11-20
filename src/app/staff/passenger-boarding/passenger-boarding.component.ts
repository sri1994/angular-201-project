import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, Routes } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-passenger-boarding',
  templateUrl: './passenger-boarding.component.html',
  styleUrls: ['./passenger-boarding.component.scss']
})

export class PassengerBoardingComponent implements OnInit, AfterViewInit {

  public isViewInitialized = false;

  public navLinks: any[] = [];

  public userObject: any = {};

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {

    this.userObject = {
      userImage: this.route.snapshot.paramMap.get('image'),
      userName: this.route.snapshot.paramMap.get('name'),
      type: this.route.snapshot.paramMap.get('type')
    };

    this.navLinks = (
      this.route.routeConfig && this.route.routeConfig.children ?
        this.buildNavItems(this.route.routeConfig.children) :
        []
    );
  }

  public ngAfterViewInit(): void {

    this.isViewInitialized = true;

    this.changeDetector.detectChanges();

  }

  public buildNavItems(routes: Routes) {

    return (routes)
      .filter(route => route.data)
      .map(({ path = '', data }) => ({
        path,
        label: data.label,
        icon: data.icon
      }));

  }

  public isLinkActive(rla: RouterLinkActive): boolean {

    const routerLink = rla.linksWithHrefs.first;

    return this.router.isActive(routerLink.urlTree, false);

  }

}
