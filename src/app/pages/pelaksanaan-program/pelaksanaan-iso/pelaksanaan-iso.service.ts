import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class PelaksanaanIsoService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    // getByJadwalUnitKerjaAuditId(jadwalUnitKerjaAuditId: number):Observable<any> {
    //     return this.http.get(
    //         `${this.API_URL}JadwalAudit/getbyjadwalunitkerjaauditid/${jadwalUnitKerjaAuditId}`,
    //     );
    // }

    getJadwalAuditByKodeUnitKerja():Observable<any> {
        return this.http.get(
            `${this.API_URL}PelaksanaanIso/getlistiso`,
        );
    }

    getUnitKerjaByJenisAudit():Observable<any> {
        return this.http.get(
            `${this.API_URL}UnitKerja/getlist`
        );
    }
}

