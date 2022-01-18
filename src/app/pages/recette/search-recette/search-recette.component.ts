import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/core/api/category/category.service';
import { Category } from 'src/app/interface/category';

@Component({
  selector: 'app-search-recette',
  templateUrl: './search-recette.component.html',
  styleUrls: ['./search-recette.component.scss']
})
export class SearchRecetteComponent implements OnInit {

  constructor(
    protected categoryService: CategoryService,
  ) { }

  unknownRecette!: boolean;
  categories!: Array<Category>;
  categoriesSelected: Array<number> = new Array();

  async getCategories() {
    await this.categoryService.getCategories()
      .toPromise()
      .then((categories: any) => {
        this.categories = categories;
        console.log(this.categories);
      })
  }

  clickCategory(categoryPK: number) {
    if(this.checkSelected(categoryPK)) {
      this.categoriesSelected = this.categoriesSelected.filter(function(value, index, array) {
        return value != categoryPK;
      })
    }
    else {
    this.categoriesSelected.push(categoryPK);
    }
  }

  checkSelected(index: number): boolean {
    if(this.categoriesSelected.includes(index)) return true;
    else return false;
  }

  searchRecette() {
    this.unknownRecette = !this.unknownRecette;
  }

  ngOnInit(): void {
    this.unknownRecette = false;
    this.getCategories();
  }

}
