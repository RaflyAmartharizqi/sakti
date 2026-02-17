import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class AktivasiUserService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    searchUserBpjs(npp: string): Observable<any> {
        return this.http.get(
        this.API_URL + `User/searchuserbpjs/${npp}`,
        );
    }

    create(payload: any) {
        return this.http.post(
            this.API_URL + 'User/insert',
            payload,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                })
            }
        );
    }

    get(filters: any):Observable<any> {
        return this.http.get(
            `${this.API_URL}User/getlistuser`,
            {
                params: {
                    tipeUser: filters.tipeUser,
                    status: filters.status ??  null,
                    page: filters.page ?? 1,
                    limit: filters.limit ?? 10,
                    search: filters.search ?? null,
                }
            }
        );
    }

    getAsesor():Observable<any> {
        return this.http.get(
            `${this.API_URL}Asesor/getlist`,
    )}

    update(id: number, payload: any) {
        return this.http.put(
            this.API_URL + `User/update/${id}`,
            payload,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                })
            }
        );
    }

    getById(id: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}User/getuserbyid/${id}`,
        );
    }

    sendActivation(id: number): Observable<any> {
        return this.http.post(
        `${this.API_URL}User/send-activation/${id}`,
        {}
        );
    }

}

