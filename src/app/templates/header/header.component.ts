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
  showMobileMenu!: boolean;

  ngOnInit(): void {
    this.showMobileMenu = false;
    this.isLogged = this.auth.checkAuth();
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
  }

  logout() {
    this.auth.logout();
  }

}
