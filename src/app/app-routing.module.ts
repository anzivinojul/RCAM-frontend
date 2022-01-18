import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guard/role/role.guard';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { AllRecetteComponent } from './pages/recette/all-recette/all-recette.component';
import { CreateRecetteComponent } from './pages/recette/create-recette/create-recette.component';
import { SearchRecetteComponent } from './pages/recette/search-recette/search-recette.component';
import { SingleRecetteComponent } from './pages/recette/single-recette/single-recette.component';
import { UpdateRecetteComponent } from './pages/recette/update-recette/update-recette.component';

const routes: Routes = [
  { path : '', pathMatch: 'full', component: AllRecetteComponent, runGuardsAndResolvers: 'always' },
  { path : 'login', component: LoginComponent },
  { path : 'create',
    component: CreateRecetteComponent,
    canActivate: [RoleGuard] },
  { path : 'recette/:id', component: SingleRecetteComponent },
  { path : 'recette/:id/update',
    component: UpdateRecetteComponent,
    canActivate: [RoleGuard], },
  { path : 'search', component: SearchRecetteComponent },
  { path: '**', component :  ErrorComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
