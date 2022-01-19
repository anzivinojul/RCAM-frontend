import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    protected auth: AuthService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.indexOf('refresh') !== -1) {
      return next.handle(request);
    }

    const accessExpired = this.auth.isTokenExpired();

    if(this.auth.checkAuth()) {

      if(accessExpired) {
        if (!this.refreshTokenInProgress) {

          this.refreshTokenInProgress = true;
          this.refreshTokenSubject.next(null);
          return this.auth.refreshJWT().pipe(
              switchMap((auth: any) => {
                  sessionStorage.setItem('jwt', auth.access);
                  this.refreshTokenInProgress = false;
                  this.refreshTokenSubject.next(auth.refresh);

                  request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + this.auth.getToken()) });
                  request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
                  return next.handle(request);
              }),
          );
        }
        else {

          return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap((res) => {
                  request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + this.auth.getToken()) });
                  request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
                  return next.handle(request)
              })
          );
        }
      }

      else {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + this.auth.getToken()) });
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        return next.handle(request);
      }
    }

    else {
      request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
      return next.handle(request);
    }

  }
}
