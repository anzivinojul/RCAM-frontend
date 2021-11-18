import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/core/api/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    protected auth: AuthService,
    private router: Router,
  ) { }

  isLogged: boolean | undefined;

  ngOnInit(): void {
    this.isLogged = this.auth.checkAuth();
  }

  refresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/']);
  }

  logout() {
    this.auth.logout();
  }

}
