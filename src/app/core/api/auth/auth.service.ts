import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/interface/role';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    protected http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  isAdmin!: boolean;

  async login(username: string, password: string) {
    await this.http.post(`${environment.apiURL}/auth/login/`, {
      username: username,
      password: password,
    })
      .toPromise()
      .then((auth: any) => {
        console.log(auth);
        sessionStorage.setItem('jwt', auth.access);
        sessionStorage.setItem('jwt_refresh', auth.refresh);
        this.router.navigate(['/']);
        location.reload();
      })
      .catch((error) => {
        console.log(error);
        this.toastr.error('Identifiants incorrects', 'Erreur', {
          timeOut: 6000,
          tapToDismiss: true,
          positionClass: 'toast-bottom-right'
        });
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
        this.login(username, password).then(() => {
          this.router.navigate(['/']);
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getToken() {
    return sessionStorage.getItem('jwt');
  }

  getDecodedToken(token: any) {
    return jwt_decode(token);
  }

  getTokenExpirationDate(token: any): Date {
    const decoded: any= jwt_decode(token);

    if (decoded.exp === undefined) return new Date();

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: any): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  refreshJWT() {
    return this.http.post(`${environment.apiURL}/auth/login/refresh/`, {"refresh": sessionStorage.getItem('jwt_refresh')})
  }

  checkAuth(): boolean {
    return sessionStorage.getItem('jwt') ? true : false;
  }

  getUser() {
    return this.http.get(`${environment.apiURL}/auth/user`);
  }

  logout() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt_refresh');
    sessionStorage.removeItem('username')
    location.reload();
  }

}
