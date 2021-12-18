import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/core/api/category/category.service';
import { ImageService } from 'src/app/core/api/image/image.service';
import { RecetteService } from 'src/app/core/api/recette/recette.service';
import { Category } from 'src/app/interface/category';
import { DifficultyType } from 'src/app/interface/difficulty';
import { Recette } from 'src/app/interface/recette';

@Component({
  selector: 'app-update-recette',
  templateUrl: './update-recette.component.html',
  styleUrls: ['./update-recette.component.scss']
})
export class UpdateRecetteComponent implements OnInit {

  constructor(
    protected categoryService: CategoryService,
    protected imageService: ImageService,
    protected recetteService: RecetteService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  recette!: Recette;

  recetteForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    numberPeople: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
    timePreparationHour: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
    timePreparationMin: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
    timeCookingHour: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
    timeCookingMin: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('[\d]*')]),
  });

  categories!: Array<Category>;
  categoryRecette = '';
  categoryPK = '';
  difficulties: Array<string> = new Array();
  difficultyRecette = '';

  ingredients: Array<string> = new Array();
  ingredient!: string;
  preparations: Array<string> = new Array();
  preparation!: string;

  imgURI!: string;
  img: any;
  imgFile = null;

  ngOnInit(): void {
    this.recette = <Recette>{};
    this.getCategories().then(() =>
      { this.getDifficulties(); }).then(() =>
        { this.getRecette(); })
  }

  async getRecette() {
    this.route.params
      .subscribe(async (param: any) => {

        await this.recetteService.getRecetteById(param.id)
          .toPromise()
          .then((recette: any) => {
            this.recette = recette;
            this.recetteForm.patchValue({
              name: recette.name,
              numberPeople: recette.people_number,
              timePreparationHour: this.getHourFromTime(recette.time_preparation),
              timePreparationMin: this.getMinFromTime(recette.time_preparation),
              timeCookingHour: this.getHourFromTime(recette.time_cooking),
              timeCookingMin: this.getMinFromTime(recette.time_cooking),
            })
            this.categoryRecette = recette.category ? recette.category.name : null;
            this.difficultyRecette = recette.difficulty;
            this.imgURI = recette.img.image;

            this.getIngredientsRecette(recette);
            this.getPreparationRecette(recette);
          })
          .catch((error: Error) => {
            this.router.navigate(['/404']);
          })

      })
  }

  async getIngredientsRecette(recette: Recette) {
    await this.recetteService.findIngredientsByIdRecette(recette.id)
      .toPromise()
      .then((ingredients: any) => {
        this.ingredients = ingredients[0].ingredients.ingredients;
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async getPreparationRecette(recette: Recette) {
    await this.recetteService.findPreparationByIdRecette(recette.id)
      .toPromise()
      .then((preparations: any) => {
        this.preparations = preparations[0].preparations.preparations;
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async getCategories() {
    await this.categoryService.getCategories()
      .toPromise()
      .then((categories: any) => {
        this.categories = categories;
      })
  }

  getPKCategory(name: string) {
    this.categoryService.findCategoryByName(name).subscribe((category: any) => {
      if(category[0]) {
        this.categoryPK = category[0].id;
      }
      else {
        this.categoryPK = '';
      }
    }), (error: any) => {
      console.log(error);
    }
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

  formatJSONArray(array: Array<string>, name: string) : string {
    return '{"' + name + '":' + JSON.stringify(array) + '}';
  }

  getHourFromTime(time: string) {
    return time.substring(0,2);
  }

  getMinFromTime(time: string) {
    return time.substring(3,5);
  }

  submit() {

  }

}
