import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/api/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    protected auth: AuthService,
  ) { }

  isLogged: boolean | undefined;

  ngOnInit(): void {
    this.isLogged = this.auth.checkAuth();
  }

  logout() {
    this.auth.logout();
  }

}
