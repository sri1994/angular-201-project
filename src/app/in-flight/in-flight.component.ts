import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'in-flight',
  templateUrl: './in-flight.component.html',
  styleUrls: ['./in-flight.component.scss']
})
export class InFlightComponent implements OnInit {

  constructor() { 
    console.log('In flight component');
  }

  ngOnInit() {
  }

}
