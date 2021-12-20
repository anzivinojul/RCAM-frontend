import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recette } from 'src/app/interface/recette';
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

  findRecettesByNameAndByCategory(name: string, category: string) {
    return this.http.get(`${environment.apiURL}/recettes/?search=` + name + `&category__name=` + category);
  }

  findIngredientsByIdRecette(id_pk: number) {
    return this.http.get(`${environment.apiURL}/recettes/ingredients?recette=` + id_pk);
  }

  findPreparationByIdRecette(id_pk: number) {
    return this.http.get(`${environment.apiURL}/recettes/preparations?recette=` + id_pk);
  }

  addRecette(recette: Recette) {
    return this.http.post(`${environment.apiURL}/recettes/add`, recette);
  }

  updateRecette(recette: Recette) {
    return this.http.put(`${environment.apiURL}/recettes/update/` + recette.id , recette);
  }

  addIngredientsToRecette(ingredientsJSON: string, recettePK: number) {

    let formData = new FormData();
    formData.append('ingredients', ingredientsJSON);
    formData.append('recette', recettePK.toString());

    return this.http.post(`${environment.apiURL}/recettes/ingredients`, formData);
  }

  updateIngredientsToRecette(ingredientsJSON: string, recettePK: number, ingredientsPK: number) {
    let formData = new FormData();
    formData.append('ingredients', ingredientsJSON);
    formData.append('recette', recettePK.toString());

    return this.http.put(`${environment.apiURL}/recettes/ingredients/` + ingredientsPK , formData);
  }

  addPreparationsToRecette(preparationsJSON: string, recettePK: number) {

    let formData = new FormData();
    formData.append('preparations', preparationsJSON);
    formData.append('recette', recettePK.toString());

    return this.http.post(`${environment.apiURL}/recettes/preparations`, formData);
  }

  updatePreparationsToRecette(preparationsJSON: string, recettePK: number, preparationsPK: number) {

    let formData = new FormData();
    formData.append('preparations', preparationsJSON);
    formData.append('recette', recettePK.toString());

    return this.http.put(`${environment.apiURL}/recettes/preparations/` + preparationsPK , formData);
  }


}
