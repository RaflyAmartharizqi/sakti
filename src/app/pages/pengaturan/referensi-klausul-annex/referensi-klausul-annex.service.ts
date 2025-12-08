import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class ReferensiKlausulAnnexService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    create(payload: any) {
        return this.http.post(
            this.API_URL + 'RefKlausulAnnex/insert',
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
            `${this.API_URL}RefKlausulAnnex/getlist`,
            {
                params: {
                    page: filters.page ?? 1,
                    limit: filters.limit ?? 10,
                    search: filters.search ?? null,
                    status: filters.status ?? null,
                }
            }
        );
    }

    update(id: number, payload: any) {
        return this.http.put(
            this.API_URL + `RefKlausulAnnex/update/${id}`,
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
            `${this.API_URL}RefPertanyaanSmki/getbyid/${id}`,
        );
    }

    getStandarAssesment():Observable<any> {
        return this.http.get(
            `${this.API_URL}StandarAssesment/getlist`,
        );
    }

}

