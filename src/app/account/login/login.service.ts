import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
    private API_URL = GlobalComponent.API_URL;
    private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    currentUser$ = this.currentUserSubject.asObservable();
    constructor(private http: HttpClient) {}

    login(payload: any) {
        return this.http.post<any>(`${this.API_URL}Auth/login`, payload).pipe(
        tap(res => {
            const user = res.response.user;
            const token = res.response.token;
            
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            sessionStorage.setItem('token', token);

            this.currentUserSubject.next(user);
        })
        );
    }
    
    logout() {
        sessionStorage.clear();
        this.currentUserSubject.next(null);
    }

    get currentUserValue() {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return !!sessionStorage.getItem('token');
    }

    private getUserFromStorage() {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
}

