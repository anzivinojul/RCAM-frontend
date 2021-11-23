import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { AllRecetteComponent } from './pages/recette/all-recette/all-recette.component';
import { CreateRecetteComponent } from './pages/recette/create-recette/create-recette.component';
import { SingleRecetteComponent } from './pages/recette/single-recette/single-recette.component';

const routes: Routes = [
  { path : '', pathMatch: 'full', component: AllRecetteComponent, runGuardsAndResolvers: 'always' },
  { path : 'login', component: LoginComponent },
  { path : 'create', component: CreateRecetteComponent },
  { path : 'recette/:id', component: SingleRecetteComponent },
  { path: '404', component :  ErrorComponent },
  { path: '**', redirectTo: '/404' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
