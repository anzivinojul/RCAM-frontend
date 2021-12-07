export interface Ingredient {

  id: number;
  ingredients: ListIngredients
  recette: number;

}

export interface ListIngredients {
  list: Array<String>;
}
