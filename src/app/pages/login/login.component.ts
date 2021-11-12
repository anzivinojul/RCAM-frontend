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
    username: new FormControl(''),
    password: new FormControl(''),
    passwordConfirmed: new FormControl(''),
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

  ngOnInit(): void {
    this.showConnexion();
  }

}
