import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators'
import { Flight } from './models/flight';

@Injectable({
  providedIn: 'root'
})
export class FlightsService {

  public baseUrl = 'http://localhost:3000/flights';

  constructor(private http: HttpClient) { 

  }

  public getFlightsList(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(delay(500));
  }

  public getFlightDetail(flightId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${flightId}`).pipe(delay(500));
  }

  public updateFlightsList(updatedFlightObject: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${updatedFlightObject.flightId}`, updatedFlightObject.flightData);
  }
}
