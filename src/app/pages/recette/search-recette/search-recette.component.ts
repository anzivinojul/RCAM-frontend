import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/core/api/category/category.service';
import { RecetteService } from 'src/app/core/api/recette/recette.service';
import { Category } from 'src/app/interface/category';
import { Recette } from 'src/app/interface/recette';

@Component({
  selector: 'app-search-recette',
  templateUrl: './search-recette.component.html',
  styleUrls: ['./search-recette.component.scss']
})
export class SearchRecetteComponent implements OnInit {

  constructor(
    protected recetteService: RecetteService,
    protected categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  unknownRecette!: boolean;
  notfoundRecette!: boolean;
  foundRecette!: boolean;

  recettes!: Array<Recette>;
  recette!: Recette;
  categories!: Array<Category>;
  categoriesSelected: Array<string> = new Array();

  async getCategories() {
    await this.categoryService.getCategories()
      .toPromise()
      .then((categories: any) => {
        this.categories = categories;
        console.log(this.categories);
      })
  }

  clickCategory(category: string) {
    if(this.checkSelected(category)) {
      this.categoriesSelected = this.categoriesSelected.filter(function(value, index, array) {
        return value != category;
      })
    }
    else {
    this.categoriesSelected.push(category);
    }
  }

  checkSelected(category: string): boolean {
    if(this.categoriesSelected.includes(category)) return true;
    else return false;
  }

  getRandomRecette(recettes: Array<Recette>) {
    this.recette = recettes[Math.floor(Math.random() * recettes.length)];
    console.log(this.recette);
  }

  async searchRecette() {
    if(this.categoriesSelected.length != 0) {
      this.recettes = new Array<Recette>();
      await this.categoriesSelected.forEach(async (category) => {
        await this.recetteService.findRecettesByNameAndByCategory('', category)
          .toPromise()
          .then((recettes: any) => {
            recettes.forEach((recette: any) => {
              this.recettes.push(recette);
            })
            this.getRandomRecette(this.recettes);

            if(this.recette) {
              this.foundRecette = true;
              this.notfoundRecette = false;
              this.unknownRecette = false;
            }
            else {
              this.foundRecette = false;
              this.notfoundRecette = true;
              this.unknownRecette = false;
            }
          });
      })
    }
    else {
      this.toastr.error('Vous devez sélectionner au moins une catégorie.', 'Proposition impossible', {
        timeOut: 6000,
        tapToDismiss: true,
        positionClass: 'toast-bottom-right'
      });
    }
  }

  formatTime(time: string): string {
    const hour = time.substring(0,2);
    const min = time.substring(3,5);

    if(hour == '00' && min == '00') return 'N/A'
    else if(hour == '00') return min + ' min'
    else if(min == '00') return hour + 'h'
    else return hour + 'h' + min
  }

  goToRecette(id: number) {
    this.router.navigate(['/recette', id])
  }

  ngOnInit(): void {
    this.unknownRecette = true;
    this.notfoundRecette = false;
    this.foundRecette = false;
    this.getCategories();
  }

}
