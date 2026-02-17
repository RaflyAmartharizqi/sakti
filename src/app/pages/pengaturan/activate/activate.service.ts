import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class ActivateService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    activate(payload: any): Observable<any> {
        return this.http.post(
        this.API_URL + `User/activate`,
        payload
        );
    }
}

