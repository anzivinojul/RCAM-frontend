import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    protected http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async login(username: string, password: string) {
    await this.http.post(`${environment.apiURL}/auth/login/`, {
      username: username,
      password: password,
    })
      .toPromise()
      .then((auth: any) => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async register(email: string, username: string, password: string, passwordConfirmed: string) {
    await this.http.post(`${environment.apiURL}/auth/register/`, {
      email: email,
      username: username,
      password: password,
      passwordConfirmed: passwordConfirmed,
    })
      .toPromise()
      .then((auth: any) => {
        console.log('Inscription réussie : ' + auth);
      })
      .catch((error) => {
        console.log(error);
      })
  }
}
