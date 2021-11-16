import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    protected http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  async login(username: string, password: string) {
    await this.http.post(`${environment.apiURL}/auth/login/`, {
      username: username,
      password: password,
    })
      .toPromise()
      .then((auth: any) => {
        sessionStorage.setItem('jwt', auth.access);
        this.router.navigate(['/']);
        location.reload();
      })
      .catch((error) => {
        console.log(error);
        this.toastr.error('Identifiants incorrects', 'Erreur');
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

  checkAuth(): boolean {
    return sessionStorage.getItem('jwt') ? true : false;
  }

  logout() {
    sessionStorage.removeItem('jwt');
    location.reload();
  }

}