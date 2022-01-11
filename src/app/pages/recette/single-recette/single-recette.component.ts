import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleModalService } from 'ngx-simple-modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/api/auth/auth.service';
import { ImageService } from 'src/app/core/api/image/image.service';
import { RecetteService } from 'src/app/core/api/recette/recette.service';
import { Ingredient } from 'src/app/interface/ingredient';
import { Preparation } from 'src/app/interface/preparation';
import { Recette } from 'src/app/interface/recette';
import { ModalComponent } from 'src/app/templates/modal/modal.component';

@Component({
  selector: 'app-single-recette',
  templateUrl: './single-recette.component.html',
  styleUrls: ['./single-recette.component.scss']
})
export class SingleRecetteComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected auth: AuthService,
    protected recetteService: RecetteService,
    protected imageService: ImageService,
    private toastr: ToastrService,
    protected simpleModalService: SimpleModalService,
  ) { }

  isLogged!: boolean;
  isAdmin!: boolean;

  recette!: Recette;
  ingredients!: Array<String>;
  preparations!: Array<String>;

  ngOnInit(): void {
    this.recette = <Recette>{};
    this.getRecette();
    this.isLogged = this.auth.checkAuth();
    this.checkAdmin();
  }

  checkAdmin() {
    if(this.isLogged) {
      this.auth.getUser().subscribe((user: any) => {
        this.isAdmin = user.groups[0] == 1 ? true : false;
      }), (error: any) => {
        this.isAdmin = false;
      }
    }
  }

  async getRecette() {
    this.route.params
      .subscribe(async (param: any) => {

        await this.recetteService.getRecetteById(param.id)
          .toPromise()
          .then((recette: any) => {
            this.recette = recette;
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
        this.router.navigate(['/404']);
      })
  }

  async getPreparationRecette(recette: Recette) {
    await this.recetteService.findPreparationByIdRecette(recette.id)
      .toPromise()
      .then((preparations: any) => {
        this.preparations = preparations[0].preparations.preparations;
      })
      .catch((error) => {
        this.router.navigate(['/404']);
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

  confirmDelete() {
    let disposable = this.simpleModalService.addModal(ModalComponent, {
      title: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer la recette ?'
    })
    .subscribe((isConfirmed)=>{
        if(isConfirmed) {

          this.recetteService.deleteRecette(this.recette.id).subscribe(() => {

            this.toastr.success('Suppression de la recette réussie', 'Suppression réussie', {
              timeOut: 6000,
              tapToDismiss: true,
              positionClass: 'toast-bottom-right'
            });

            this.imageService.deleteImage(this.recette.img.id).subscribe(() => {

              this.router.navigate(['/']);

            }), (error:any) => {
              this.toastr.error('Suppression de l\'image de la recette échouée', 'Suppression échouée', {
                timeOut: 6000,
                tapToDismiss: true,
                positionClass: 'toast-bottom-right'
              });
            }
          }), (error:any) => {
            this.toastr.error('Suppression de la recette échouée', 'Suppression échouée', {
              timeOut: 6000,
              tapToDismiss: true,
              positionClass: 'toast-bottom-right'
            });
          }
        }
    });

  }

}
