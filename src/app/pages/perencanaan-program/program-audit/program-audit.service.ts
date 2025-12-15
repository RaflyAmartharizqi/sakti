import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class ProgramAudit {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    create(payload: any) {
        return this.http.post(
            this.API_URL + 'ProgramAudit/insert',
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
            `${this.API_URL}ProgramAudit/getlist`,
            {
                params: {
                    page: filters.page ?? 1,
                    limit: filters.limit ?? 10,
                    search: filters.search ?? null,
                    periode: filters.periode ?? null,
                }
            }
        );
    }

    update(id: number, payload: any) {
        return this.http.put(
            this.API_URL + `ProgramAudit/update/${id}`,
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
            `${this.API_URL}ProgramAudit/getbyid/${id}`,
        );
    }

    getUnitKerjaByJenisAudit():Observable<any> {
        return this.http.get(
            `${this.API_URL}UnitKerja/getlist`
        );
    }

    getStandarAssesment():Observable<any> {
        return this.http.get(
            `${this.API_URL}StandarAssesment/getlist`
        );
    }

}

