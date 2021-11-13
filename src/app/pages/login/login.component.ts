import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/api/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    protected auth: AuthService
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


  showConnexion() {
    this.tabs = true;
    this.loginTitle = 'Connexion'
  }

  showInscription() {
    this.tabs = false;
    this.loginTitle = 'Inscription'
  }

  login() {
    this.auth.login(this.loginForm.value.username, this.loginForm.value.password);
  }

  register() {
    this.auth.register(this.registerForm.value.email, this.registerForm.value.username, this.registerForm.value.password, this.registerForm.value.passwordConfirmed);
  }

  ngOnInit(): void {
    this.showConnexion();
  }

}
