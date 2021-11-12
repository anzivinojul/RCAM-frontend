import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    protected http: HttpClient,
  ) { }

  async login(username: string, password: string) {
    await this.http.post(`${environment.apiURL}/api-token-auth/`, {
      username: username,
      password: password,
    })
      .toPromise()
      .then((auth: any) => {
        console.log(auth);
      })
      .catch((error) => {
        console.log(error);
      })
  }
}
