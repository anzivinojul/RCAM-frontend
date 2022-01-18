import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './templates/header/header.component';
import { LoginComponent } from './pages/login/login.component';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestInterceptor } from './core/interceptor/request.interceptor';
import { AllRecetteComponent } from './pages/recette/all-recette/all-recette.component';
import { CreateRecetteComponent } from './pages/recette/create-recette/create-recette.component';
import { SingleRecetteComponent } from './pages/recette/single-recette/single-recette.component';
import { ErrorComponent } from './pages/error/error.component';
import { DigitOnlyDirective } from './directive/digit-only.directive';
import { UpdateRecetteComponent } from './pages/recette/update-recette/update-recette.component';
import { ModalComponent } from './templates/modal/modal.component';

import { ToastrModule } from 'ngx-toastr';
import { defaultSimpleModalOptions, SimpleModalModule } from 'ngx-simple-modal';
import { SearchRecetteComponent } from './pages/recette/search-recette/search-recette.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ModalComponent,
    LoginComponent,
    AllRecetteComponent,
    CreateRecetteComponent,
    SingleRecetteComponent,
    UpdateRecetteComponent,
    ErrorComponent,
    DigitOnlyDirective,
    SearchRecetteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    //NGX-TOASTR
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),

    //NGX-SIMPLE-MODAL
    //ModalComponent,
    SimpleModalModule.forRoot({container: 'modal-container'}, {...defaultSimpleModalOptions, ...{
      closeOnEscape: true,
      closeOnClickOutside: true,
      draggable: true,
      animationDuration: 300,
      autoFocus: true }}),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    ModalComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
