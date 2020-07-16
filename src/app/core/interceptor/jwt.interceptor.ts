import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError as observableThrowError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService) { }

  addToken(request: HttpRequest<any>): HttpRequest<any> {
    if (this.authService.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.storageService.get('access_token')}`
        }
      });
    }
    return request;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    const that = this;
    request = that.addToken(request);


    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 403) {
          that.logoutUser();
        }

        return observableThrowError(error);
      })
    );
  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
