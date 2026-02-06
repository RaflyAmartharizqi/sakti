import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class TindakLanjutService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    getPertanyaanTindakLanjut(jadwalUnitKerjaAuditId: any):Observable<any> {
        return this.http.get(
            `${this.API_URL}AuditLog/getlistpertanyaantl`,
            {
                params: {
                    JadwalUnitKerjaAuditId: jadwalUnitKerjaAuditId ?? '',
                }
            }
        );
    }
    saveTindakLanjut(payload: any): Observable<any> {
        return this.http.post(
            `${this.API_URL}AuditLog/savetindaklanjutasesi`,
            payload
        );
    }
    reviewTindakLanjut(payload: any): Observable<any> {
        return this.http.post(
            `${this.API_URL}AuditLog/savereviewtindaklanjutasesor`,
            payload
        );
    }

    kirimKeAsesor(payload: any): Observable<any> {
        return this.http.post(
            `${this.API_URL}AuditLog/tindaklanjutkirimkeasesor`,
            payload
        );
    }

    kirimKeAsesi(payload: any): Observable<any> {
        return this.http.post(
            `${this.API_URL}AuditLog/tindaklanjutkirimkeasesi`,
            payload
        );
    }

    getRating():Observable<any> {
        return this.http.get(
            `${this.API_URL}Rating/getlist`
        );
    }
}