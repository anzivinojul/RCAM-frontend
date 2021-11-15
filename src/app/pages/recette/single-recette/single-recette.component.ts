import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecetteService } from 'src/app/core/api/recette/recette.service';

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

  ngOnInit(): void {

  }

  getRecette() {
  /*
    this.route.params
      .subscribe(async (id) => {

        await this.recetteService.getRecetteById(id)
          .toPromise()
          .then(recette: any) => {
            console.log(recette);

          }
      })
  */
  }


}
