import { Component, OnInit } from '@angular/core';
import { RecetteService } from 'src/app/core/api/recette/recette.service';
import { Recette } from 'src/app/interface/recette';

@Component({
  selector: 'app-all-recette',
  templateUrl: './all-recette.component.html',
  styleUrls: ['./all-recette.component.scss']
})
export class AllRecetteComponent implements OnInit {

  constructor(
    protected recetteService: RecetteService,
  ) { }

  recettesInfos!: Array<Recette>;

  ngOnInit(): void {
    this.getRecettes();
  }

  async getRecettes() {
    await this.recetteService.findRecettes()
      .toPromise()
      .then((recettes: any) => {
        this.recettesInfos = recettes;
      })
  }

}
