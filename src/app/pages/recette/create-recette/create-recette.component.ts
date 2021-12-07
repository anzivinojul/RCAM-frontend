import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/core/api/category/category.service';
import { ImageService } from 'src/app/core/api/image/image.service';
import { RecetteService } from 'src/app/core/api/recette/recette.service';
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
    protected recetteService: RecetteService,
  ) { }

  recetteForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    numberPeople: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
    timePreparationHour: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
    timePreparationMin: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
    timeCookingHour: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
    timeCookingMin: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
  });

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
        this.imgFile = event.target.files[0];

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

  formatTime(timeHour: string, timeMin: string) {

    //1 digit for hour
    if(timeHour.length == 1) {

      //1 digit for min
      if(timeMin.length == 1) {
        return '0' + timeHour + ':' + '0' + timeMin;
      }

      //2 digit for min
      else {
        return '0' + timeHour + ':' + timeMin;
      }
    }

    //2 digit for hour
    else {

      //1 digit for min
      if(timeMin.length == 1) {
        return timeHour + ':' + '0' + timeMin;
      }

      //2 digit for min
      else {
        return timeHour + ':' + timeMin;
      }
    }
  }

  submit() {

    //upload image
    console.log(this.imgFile);

    this.imageService.uploadImage(this.recetteForm.value.name, this.imgFile).subscribe((response) => {
      console.log('image enregistrée');
      console.log(response);
    },
    (error) => {
      console.log(error);
    });


    //create recette [WORKING]
    /*
    const recette: Recette = {
      id: 0,
      name: this.recetteForm.value.name,
      time_preparation: this.formatTime(this.recetteForm.value.timePreparationHour, this.recetteForm.value.timePreparationMin),
      time_cooking: this.formatTime(this.recetteForm.value.timeCookingHour, this.recetteForm.value.timeCookingMin),
      number_people: this.recetteForm.value.numberPeople,
      category: '2',
      difficulty: this.difficultyRecette,
      favorite: false,
      img: '9',
    }

    this.recetteService.addRecette(recette).subscribe((response) => {
      console.log(response);
    }), (error: any) => {
      console.log(error);
    };
    */

    //create ingredients recette
    //create preparations recette

  }

}
