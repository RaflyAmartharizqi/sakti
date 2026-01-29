import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class JadwalAuditService {

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
            `${this.API_URL}JadwalAudit/getlist`,
            {
                params: {
                    page: filters.page ?? 1,
                    limit: filters.limit ?? 10,
                    search: filters.search ?? null,
                    programAuditId: filters.programAuditId ?? null,
                }
            }
        );
    }

    getEditSmki(jadwalUnitKerjaAuditId: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}JadwalAudit/geteditsmki/${jadwalUnitKerjaAuditId}`,
        );
    }

    getEditIso(jadwalAuditId: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}JadwalAudit/geteditiso/${jadwalAuditId}`,
        );
    }

    getUnitKerjaByJenisAudit():Observable<any> {
        return this.http.get(
            `${this.API_URL}UnitKerja/getlist`
        );
    }

    updateSmki(payload: any) {
        return this.http.put(
            this.API_URL + `JadwalAudit/updatesmki`,
            payload,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                })
            }
        );
    }

    updateIso(payload: any) {
        return this.http.put(
            this.API_URL + `JadwalAudit/updateiso`,
            payload,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                })
            }
        );
    }

    getListUserByAsesor(kode: string):Observable<any> {
        return this.http.get(
            `${this.API_URL}User/getlistuserbyasesor/${kode}`,
        );
    }

}

