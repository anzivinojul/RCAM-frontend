import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecetteService } from 'src/app/core/api/recette/recette.service';
import { Recette } from 'src/app/interface/recette';

@Component({
  selector: 'app-single-recette',
  templateUrl: './single-recette.component.html',
  styleUrls: ['./single-recette.component.scss']
})
export class SingleRecetteComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    protected recetteService: RecetteService,
  ) { }

  recette!: Recette;

  ngOnInit(): void {
    this.getRecette();
  }

  getRecette() {
    this.route.params
      .subscribe(async (param: any) => {

        await this.recetteService.getRecetteById(param.id)
          .toPromise()
          .then((recette: any) => {
            this.recette = recette;
          })

      })
  }


}
