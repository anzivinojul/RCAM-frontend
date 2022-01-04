import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    if(this.auth.checkAuth()) {
      return this.auth.getUser().pipe(map((user: any) => {
        if (user.groups[0] == 1) return true;
        else return false;
      }))
    }
    else {
      this.router.navigate(['/']);
      return of(false);
    }
  }

}
