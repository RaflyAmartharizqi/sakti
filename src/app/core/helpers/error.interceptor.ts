import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Token } from 'prismjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private token: TokenStorageService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err: any) => {
                console.log('TOKEN:', this.token.getToken());

                if (err.status === 401) {
                this.authenticationService.logout();
                this.router.navigate(['/login']);
                }

                // KEMBALIKAN error ASPALNYA ke component
                return throwError(() => err);
            })
            );
    }
}
