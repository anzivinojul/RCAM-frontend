import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  login: boolean | undefined;

  showConnexion() {
    this.login = true;
  }

  showInscription() {
    this.login = false;
  }

  ngOnInit(): void {
    this.login = true;
  }

}
