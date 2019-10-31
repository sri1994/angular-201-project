import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public credentialList: any[] = [];

  public adminCredential: any[] = [];
  public staffCredential: any[] = [];

  public baseUrl = 'http://localhost:3000/credentials';

  constructor(private http: HttpClient) { }

  public getCredentialList(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(delay(500));
  }

  public updateWhetherAuthenticated(userObject: any): Observable<any> {

    if (userObject.id === 'admin') {
      if (this.adminCredential.length > 0) {
        this.adminCredential[0].isAuthenticated = userObject.isLogin ? true : false;
        localStorage.setItem('isLoggedIn', 'Y');
        return this.http.put(`${this.baseUrl}/${userObject.id}`, this.adminCredential[0]).pipe(delay(500));
      } else {
        localStorage.setItem('isLoggedIn', 'N');
      }
    } else if (userObject.id === 'staff') {
      if (this.staffCredential.length > 0) {
        this.staffCredential[0].isAuthenticated = userObject.isLogin ? true : false;
        localStorage.setItem('isLoggedIn', 'Y');
        return this.http.put(`${this.baseUrl}/${userObject.id}`, this.staffCredential[0]).pipe(delay(500));
      } else {
        localStorage.setItem('isLoggedIn', 'N');
      }
    } else {
      return this.http.put(`${this.baseUrl}/${userObject.id}`, {}).pipe(delay(500));
    }
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'Y';
  }

  public isLoggedOut(): boolean {
    return false;
  }
}
