import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/core/api/category/category.service';
import { RecetteService } from 'src/app/core/api/recette/recette.service';
import { Category } from 'src/app/interface/category';
import { Recette } from 'src/app/interface/recette';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/core/api/auth/auth.service';

@Component({
  selector: 'app-all-recette',
  templateUrl: './all-recette.component.html',
  styleUrls: ['./all-recette.component.scss']
})
export class AllRecetteComponent implements OnInit {

  constructor(
    protected authService: AuthService,
    protected recetteService: RecetteService,
    protected categoryService: CategoryService,
    private router: Router,
  ) { }

  recettesInfos!: Array<Recette>;
  categories!: Array<Category>;
  filterNameRecette!: string;
  filterCategoryRecette!: string;

  ngOnInit(): void {
    this.resetFilter();
    this.getRecettes();
    this.getCategories();
  }

  resetFilter() {
    this.filterNameRecette = '';
    this.filterCategoryRecette = '';
  }

  async getCategories() {
    await this.categoryService.getCategories()
      .toPromise()
      .then((categories: any) => {
        this.categories = categories;
      })
  }

  async getRecettes() {
    await this.recetteService.findRecettes()
      .toPromise()
      .then((recettes: any) => {
        this.recettesInfos = recettes;
      })
  }

  async getRecettesByNameAndByCategory(name: string, category: string) {

    if(category === 'Choisir une catégorie') {
      category = '';
    }

    await this.recetteService.findRecettesByNameAndByCategory(name, category)
      .toPromise()
      .then((recettes: any) => {
        this.recettesInfos = recettes;
      })
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

}
