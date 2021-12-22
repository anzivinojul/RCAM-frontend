import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleModalService } from 'ngx-simple-modal';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/core/api/category/category.service';
import { ImageService } from 'src/app/core/api/image/image.service';
import { RecetteService } from 'src/app/core/api/recette/recette.service';
import { Category } from 'src/app/interface/category';
import { DifficultyType } from 'src/app/interface/difficulty';
import { Recette } from 'src/app/interface/recette';
import { ModalComponent } from 'src/app/templates/modal/modal.component';

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
    private toastr: ToastrService,
    protected simpleModalService: SimpleModalService,
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

  ingredientsPK!: number;
  ingredientsOnInit: Array<string> = new Array();
  ingredients: Array<string> = new Array();
  ingredient!: string;
  preparationsPK!: number;
  preparationsOnInit: Array<string> = new Array();
  preparations: Array<string> = new Array();
  preparation!: string;

  imgURI!: string;
  img: any;
  imgFile = null;
  imgUploaded = '';

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
        this.ingredientsPK = ingredients[0].id;
        this.ingredients = ingredients[0].ingredients.ingredients;
        this.ingredientsOnInit = [...this.ingredients];
      })
      .catch((error) => {
        this.router.navigate(['/404']);
      })
  }

  async getPreparationRecette(recette: Recette) {
    await this.recetteService.findPreparationByIdRecette(recette.id)
      .toPromise()
      .then((preparations: any) => {
        this.preparationsPK = preparations[0].id;
        this.preparations = preparations[0].preparations.preparations;
        this.preparationsOnInit = [...this.preparations];
      })
      .catch((error) => {
        this.router.navigate(['/404']);
      })
  }

  async getCategories() {
    await this.categoryService.getCategories()
      .toPromise()
      .then((categories: any) => {
        this.categories = categories;
      }), (error:any) => {
        this.router.navigate(['/404']);
      }
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

  compareRecettesEqual(recette: Recette): boolean {
    if(this.recette.name == recette.name &&
       this.recette.time_preparation == recette.time_preparation &&
       this.recette.time_cooking == recette.time_cooking &&
       this.recette.people_number == recette.people_number &&
       this.recette.category.id == recette.category &&
       this.recette.difficulty == recette.difficulty &&
       this.recette.favorite == recette.favorite &&
       this.recette.img.id == recette.img) {

        return true;
    }
    else return false;
  }

  compareIngredientsEqual(ingredients: Array<string>): boolean {
    if(JSON.stringify(ingredients) == JSON.stringify(this.ingredients)) {
      return true;
    }
    else return false;
  }

  comparePreparationsEqual(preparations: Array<string>): boolean {
    if(JSON.stringify(preparations) == JSON.stringify(this.preparations)) {
      return true;
    }
    else return false;
  }

  verifyChanges(recette: Recette): boolean {

    if(this.imgURI != this.recette.img.image ||
      !this.compareRecettesEqual(recette) ||
      !this.compareIngredientsEqual(this.ingredientsOnInit) ||
      !this.comparePreparationsEqual(this.preparationsOnInit)) {

      return true;
    }
    else return false;
  }

  verifyForm(): boolean {
    if(this.recetteForm.valid &&
       (this.categoryPK != '' || this.categoryRecette) &&
       this.difficultyRecette != '' &&
       this.imgURI != null &&
       this.ingredients.length != 0 &&
       this.preparations.length != 0) {
      return true;
    }
    else return false;
  }

  async updateRecette(recette: Recette) {
    if(this.imgURI != this.recette.img.image) {

      this.imageService.uploadImage(this.recetteForm.value.name, this.imgFile).subscribe((image: any) => {

        recette.img = image.id;

        //TODO: delete previous image from server
        if(this.recette.img.id != 1) {
          this.imageService.deleteImage(this.recette.img.id).subscribe(() => {
          }), (error: any) => {
            console.log(error);
          }
        }

        if(!this.compareRecettesEqual(recette)) {

          this.recetteService.updateRecette(recette).subscribe(() => {
          }), (error: any) => {
            this.toastr.error('Modification des informations de la recette échouées', 'Modification échoué', {
              timeOut: 6000,
              tapToDismiss: true,
              positionClass: 'toast-bottom-right'
            });
          }
        }
      }), (error: any) => {
        this.toastr.error('Modification de l\'image de la recette échouée', 'Modification échoué', {
          timeOut: 6000,
          tapToDismiss: true,
          positionClass: 'toast-bottom-right'
        });
      }

    } else {

      if(!this.compareRecettesEqual(recette)) {

        this.recetteService.updateRecette(recette).subscribe(() => {
        }), (error: any) => {
          this.toastr.error('Modification des informations de la recette échouées', 'Modification échoué', {
            timeOut: 6000,
            tapToDismiss: true,
            positionClass: 'toast-bottom-right'
          });
        }
      }
    }

    if(!this.compareIngredientsEqual(this.ingredientsOnInit)) {

      this.recetteService.updateIngredientsToRecette(this.formatJSONArray(this.ingredients, 'ingredients'), this.recette.id, this.ingredientsPK).subscribe(() => {
      }), (error: any) => {
        this.toastr.error('Modification des ingrédients de la recette échouées', 'Modification échoué', {
          timeOut: 6000,
          tapToDismiss: true,
          positionClass: 'toast-bottom-right'
        });
      }
    }

    if(!this.comparePreparationsEqual(this.preparationsOnInit)) {

      this.recetteService.updatePreparationsToRecette(this.formatJSONArray(this.preparations, 'preparations'), this.recette.id, this.preparationsPK).subscribe(() => {
      }), (error: any) => {
        this.toastr.error('Modification des préparations de la recette échouées', 'Modification échoué', {
          timeOut: 6000,
          tapToDismiss: true,
          positionClass: 'toast-bottom-right'
        });
      }
    }

  }

  submit() {
    const recette: Recette = {
      id: this.recette.id,
      name: this.recetteForm.value.name,
      time_preparation: this.formatTime(this.recetteForm.value.timePreparationHour, this.recetteForm.value.timePreparationMin),
      time_cooking: this.formatTime(this.recetteForm.value.timeCookingHour, this.recetteForm.value.timeCookingMin),
      people_number: this.recetteForm.value.numberPeople,
      category: this.categoryPK ? this.categoryPK : this.recette.category.id,
      difficulty: this.difficultyRecette,
      favorite: false,
      img: this.recette.img.id,
    }

    if(this.verifyForm()) {

      if(this.verifyChanges(recette)) {

        let disposable = this.simpleModalService.addModal(ModalComponent, {
          title: 'Confirmation',
          message: 'Voulez-vous vraiment modifier la recette ?'
        })
        .subscribe((isConfirmed)=>{
            if(isConfirmed) {
              this.updateRecette(recette).then(() => {
                this.toastr.success('Modification de de la recette réussie', 'Modification réussie', {
                  timeOut: 6000,
                  tapToDismiss: true,
                  positionClass: 'toast-bottom-right'
                });
                this.router.navigate(['/']);
              })
            }
          })
      }

      else {
        this.toastr.warning('Vous n\'avez effectué aucun changement', 'Modification impossible', {
          timeOut: 6000,
          tapToDismiss: true,
          positionClass: 'toast-bottom-right'
        });
      }
    }

    else {
      this.toastr.warning('Il manque des informations pour pouvoir modifier la recette', 'Modification impossible', {
        timeOut: 6000,
        tapToDismiss: true,
        positionClass: 'toast-bottom-right'
      });
    }
  }

}
