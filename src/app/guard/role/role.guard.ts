import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/api/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  isAdmin!: boolean;

  constructor(
    protected auth: AuthService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(this.auth.checkAuth()) {
      this.auth.getUser().subscribe((user: any) => {
        this.isAdmin = user.groups[0] == 1 ? true : false;
      }), (error: any) => {
        this.isAdmin = false;
      }
      if(this.isAdmin) {
        return true;
      }
      else {
        this.router.navigate(['/']);
        return false;
      }
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }

}
