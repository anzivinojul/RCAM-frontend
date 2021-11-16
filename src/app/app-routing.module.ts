import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AllRecetteComponent } from './pages/recette/all-recette/all-recette.component';
import { CreateRecetteComponent } from './pages/recette/create-recette/create-recette.component';
import { SingleRecetteComponent } from './pages/recette/single-recette/single-recette.component';

const routes: Routes = [
  { path : 'login', component: LoginComponent },
  { path : 'create', component: CreateRecetteComponent },
  { path : 'recette/:id', component: SingleRecetteComponent },
  { path : '', component: AllRecetteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
