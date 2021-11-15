import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecetteService {

  constructor(
    protected http: HttpClient,
    protected auth: AuthService,
  ) { }

  findRecettes() {
    return this.http.get(`${environment.apiURL}/recettes/`);
  }

}
