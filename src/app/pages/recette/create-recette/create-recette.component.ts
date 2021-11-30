import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/core/api/category/category.service';
import { ImageService } from 'src/app/core/api/image/image.service';
import { Category } from 'src/app/interface/category';
import { DifficultyType } from 'src/app/interface/difficulty';
import { Recette } from 'src/app/interface/recette';

@Component({
  selector: 'app-create-recette',
  templateUrl: './create-recette.component.html',
  styleUrls: ['./create-recette.component.scss']
})
export class CreateRecetteComponent implements OnInit {

  constructor(
    protected categoryService: CategoryService,
    protected imageService: ImageService,
  ) { }

  categories!: Array<Category>;
  categoryRecette!: string;
  difficulties: Array<string> = new Array();
  difficultyRecette!: string;

  ingredients: Array<string> = new Array();
  ingredient!: string;
  preparations: Array<string> = new Array();
  preparation!: string;

  imgURI!: string;
  img: any;
  imgFile: any;

  ngOnInit(): void {
    this.getCategories();
    this.getDifficulties();
  }

  async getCategories() {
    await this.categoryService.getCategories()
      .toPromise()
      .then((categories: any) => {
        this.categories = categories;
      })
  }

  getDifficulties() {
    this.difficulties.push(DifficultyType.Facile.toString(), DifficultyType.Intermédiaire.toString(), DifficultyType.Difficile.toString());
    this.difficultyRecette = 'Choisir une difficulté';
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {

      const [file] = event.target.files;

      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imgURI = reader.result as string;

        //this.recetteForm.patchValue({
          //fileSource: reader.result
        //});
        this.imgFile = reader.result;

      };

    }
  }

  addIngredient() {
    this.ingredients.push(this.ingredient);
    this.ingredient = '';
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }

  addPreparation() {
    this.preparations.push(this.preparation);
    this.preparation = '';
  }

  deletePreparation(index: number) {
    this.preparations.splice(index, 1);
  }

  getUpPreparation(index: number) {
    if(this.preparations.length > 1 && index != 0) {
      [this.preparations[index-1], this.preparations[index]] = [this.preparations[index], this.preparations[index-1]];
    }
  }

  getDownPreparation(index: number) {
    if(this.preparations.length > 1 && index != this.preparations.length - 1) {
      [this.preparations[index], this.preparations[index+1]] = [this.preparations[index+1], this.preparations[index]];
    }
  }

  getNumeroPreparation() {
    return this.preparations.length + 1;
  }

  submit() {

    //upload image
    console.log(this.imgFile);

    this.imageService.uploadImage('Image', this.imgFile).subscribe(() => {
      console.log('image enregistrée');
    },
    (error) => {
      console.log(error);
    });
    //create recette
    //create ingredients recette
    //create preparations recette

    /*
    const recette = {

      name: 'Purée',
      time_preparation: '00:30',
      time_cooking: '00:15',
      img: 'recette_img/Purée.jpg',
      category: 1,
      favorite: true,
      difficulty: 'Facile',
    }

    console.log(recette);
    */
  }

}
