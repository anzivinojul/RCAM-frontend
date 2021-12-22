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

  isLogged!: boolean;
  isAdmin!: boolean;
  showMobileMenu!: boolean;

  ngOnInit(): void {
    this.showMobileMenu = false;
    this.isLogged = this.auth.checkAuth();
    this.checkAdmin();
  }

  checkAdmin() {
    this.auth.getUser().subscribe((user: any) => {
      this.isAdmin = user.groups[0] == 1 ? true : false;
    }), (error: any) => {
      this.isAdmin = false;
    }
  }

  detectResize(event: Event) {
    if(window.innerWidth > 800) {
      this.showMobileMenu = false;
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  refresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/']);

    console.log(this.auth.isTokenExpired())
    console.log(this.auth.getTokenExpirationDate(this.auth.getToken()));
    console.log(this.auth.getDecodedToken(this.auth.getToken()));


  }

  logout() {
    this.auth.logout();
  }

}
