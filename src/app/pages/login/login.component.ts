import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/api/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    protected auth: AuthService,
    private router: Router,
  ) { }

  tabs: boolean | undefined;
  loginTitle: string | undefined;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordConfirmed: new FormControl('', [Validators.required]),
  });

  errorMessage: string | undefined;

  showConnexion() {
    this.tabs = true;
    this.loginTitle = 'Connexion'
  }

  showInscription() {
    this.tabs = false;
    this.loginTitle = 'Inscription'
  }

  async login() {
    if(this.loginForm.invalid) {
      this.errorMessage = 'Veuillez vérifier votre not d\'/utilisateur ou mot de passe';
    }
    else {
      await this.auth.login(this.loginForm.value.username, this.loginForm.value.password)
      .then(() => {
        location.reload();
      });
    }
  }

  async register() {
    if(this.registerForm.invalid) {
      this.errorMessage = 'Veuillez vérifier que les champs sont bien complétés';
    }
    else if(this.registerForm.value.password != this.registerForm.value.passwordConfirmed) {
      this.errorMessage = 'Vos mots de passe ne sont pas identiques';
    }
    else {
      await this.auth.register(this.registerForm.value.email, this.registerForm.value.username, this.registerForm.value.password, this.registerForm.value.passwordConfirmed)
      .then(() => {
        location.reload();
      })
    }
  }

  ngOnInit(): void {
    if(this.auth.checkAuth()) {
      this.router.navigate(['/']);
    }
    this.showConnexion();
  }

}
