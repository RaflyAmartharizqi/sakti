import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../global-component';
import { filter } from 'lodash';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class AssesPenilaianService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    getListPertanyaanPenilaian(transaksiAuditId: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}PenilaianVerifikasi/getlistpertanyaanpenilaian`,
            { 
                params: {
                    transaksiAuditId: transaksiAuditId,
                }
            }
        );
    }

    getRefKlausulAnnexByStandar(standarAssesmentId: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}RefKlausulAnnex/getbystandar/${standarAssesmentId}`
        );
    }

    saveDraftTanggapan(payload: FormData):Observable<any> {
        return this.http.post(
            `${this.API_URL}PenilaianVerifikasi/savedrafttanggapan`,
            payload
        );
    }

    submitTanggapan(payload: FormData):Observable<any> {
        return this.http.post(
            `${this.API_URL}PenilaianVerifikasi/submittanggapan`,
            payload
        );
    }

    getAttachmentPreviewUrl(id: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}Attachment/preview/${id}`
        );
    }

    getRating():Observable<any> {
        return this.http.get(
            `${this.API_URL}Rating/getlist`
        );
    }
}

