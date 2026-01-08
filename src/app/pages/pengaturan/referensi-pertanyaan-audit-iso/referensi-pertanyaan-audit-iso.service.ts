import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class ReferensiPertanyaanAuditIso {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    create(payload: any) {
        return this.http.post(
            this.API_URL + 'RefPertanyaanAudit/insert',
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
            `${this.API_URL}RefPertanyaanAudit/getlist/iso`,
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
            this.API_URL + `RefPertanyaanAudit/update/${id}`,
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
            `${this.API_URL}RefPertanyaanAudit/getbyid/${id}`,
        );
    }

    getBidangIso():Observable<any> {
        return this.http.get(
            `${this.API_URL}Bidang/getlist/iso`,
        );
    }

    getRefKlausulAnnexByStandar(standarAssesmentId: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}RefKlausulAnnex/getbystandar/${standarAssesmentId}`
        );
    }

    getRefKlausulAnnexById(id: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}RefKlausulAnnex/getbyid/${id}`
        );
    }

    getStandarAssesment():Observable<any> {
        return this.http.get(
            `${this.API_URL}StandarAssesment/getlist`
        );
    }

}

