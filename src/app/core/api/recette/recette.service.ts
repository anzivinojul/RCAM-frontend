import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecetteService {

  constructor(
    protected http: HttpClient,
  ) { }

  getRecetteById(id_pk: number) {
    return this.http.get(`${environment.apiURL}/recettes/` + id_pk);
  }

  findRecettes() {
    return this.http.get(`${environment.apiURL}/recettes/`);
  }

  findRecettesByName(name: string) {
    return this.http.get(`${environment.apiURL}/recettes/findRecettes/byName/?search=` + name);
  }

  findRecettesByCategory(category: string) {
    return this.http.get(`${environment.apiURL}/recettes/findRecettes/byName/?category=` + category);
  }

  findRecettesByNameAndByCategory(name: string, category: string) {
    return this.http.get(`${environment.apiURL}/recettes/findRecettes/byNameAndByCategory/?search=` + name + `&category__name=` + category);
  }

}
