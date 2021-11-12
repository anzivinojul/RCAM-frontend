import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  login: boolean | undefined;
  loginTitle: string | undefined;

  showConnexion() {
    this.login = true;
    this.loginTitle = 'Connexion'
  }

  showInscription() {
    this.login = false;
    this.loginTitle = 'Inscription'
  }

  ngOnInit(): void {
    this.showConnexion();
  }

}
