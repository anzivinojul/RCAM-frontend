import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private router: Router,
    private toastr: ToastrService,
  ) { }

  recetteForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    numberPeople: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    timePreparationHour: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    timePreparationMin: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    timeCookingHour: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    timeCookingMin: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
  });

  categories!: Array<Category>;
  categoryRecette!: string;
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

  getPKCategory(name: string) {
    this.categoryService.findCategoryByName(name).subscribe((category: any) => {
      if(category[0]) {
        this.categoryPK = category[0].id;
      }
      else {
        this.categoryPK = '';
      }
    }), (error: any) => {
      this.router.navigate(['/404']);
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

  verifyForm(): boolean {
    if(this.recetteForm.valid &&
       this.categoryPK != '' &&
       this.difficultyRecette != '' &&
       this.imgURI != null &&
       this.ingredients.length != 0 &&
       this.preparations.length != 0) {
      return true;
    }
    else return false;
  }

  async addRecette() {
    //upload image
    this.imageService.uploadImage(this.recetteForm.value.name, this.imgFile).subscribe((image: any) => {

      //build recette
      const recette: Recette = {
        id: 0,
        name: this.recetteForm.value.name,
        time_preparation: this.formatTime(this.recetteForm.value.timePreparationHour, this.recetteForm.value.timePreparationMin),
        time_cooking: this.formatTime(this.recetteForm.value.timeCookingHour, this.recetteForm.value.timeCookingMin),
        people_number: this.recetteForm.value.numberPeople,
        category: this.categoryPK,
        difficulty: this.difficultyRecette,
        favorite: false,
        img: image.id,
      }

      //create recette
      this.recetteService.addRecette(recette).subscribe((recette: any) => {

        //create ingredients recette
        this.recetteService.addIngredientsToRecette(this.formatJSONArray(this.ingredients, 'ingredients'), recette.id).subscribe((ingredient: any) => {

          //create preparations recette
          this.recetteService.addPreparationsToRecette(this.formatJSONArray(this.preparations, 'preparations'), recette.id).subscribe((preparations)=> {

            this.router.navigate(['/']);

          }), (error: any) => {
            this.toastr.error('Ajout de la préparation de la recette échoué', 'Ajout échoué', {
              timeOut: 6000,
              tapToDismiss: true,
              positionClass: 'toast-bottom-right'
            });
          }
        }), (error: any) => {
          this.toastr.error('Ajout des ingrédients de la recette échoué', 'Ajout échoué', {
            timeOut: 6000,
            tapToDismiss: true,
            positionClass: 'toast-bottom-right'
          });
        }
      }), (error: any) => {
        this.toastr.error('Ajout des informations de la recette échoué', 'Ajout échoué', {
          timeOut: 6000,
          tapToDismiss: true,
          positionClass: 'toast-bottom-right'
        });
      };
    }), (error: any) => {
      this.toastr.error('Ajout de l\'image de la recette échoué', 'Ajout échoué', {
            timeOut: 6000,
            tapToDismiss: true,
            positionClass: 'toast-bottom-right'
      });
    };
  }

  submit() {

    if(this.verifyForm()) {

      this.addRecette().then(() => {
        this.toastr.success('Ajout de de la recette réussi', 'Ajout réussi', {
          timeOut: 6000,
          tapToDismiss: true,
          positionClass: 'toast-bottom-right'
        });
      })

    }

    else {
      this.toastr.warning('Il manque des informations pour pouvoir ajouter la recette', 'Ajout impossible', {
        timeOut: 6000,
        tapToDismiss: true,
        positionClass: 'toast-bottom-right'
      });
    }

  }

}
