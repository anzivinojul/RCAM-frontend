import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    protected http: HttpClient,
  ) { }

  getCategories() {
    return this.http.get(`${environment.apiURL}/category/`);
  }
}
