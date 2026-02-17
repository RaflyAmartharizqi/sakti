import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../global-component';
import { filter } from 'lodash';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class AssesSmkiService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    getListPertanyaanSmki(transaksiAuditId: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}PengisianSmki/getlistpertanyaansmki`,
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

    saveDraftJawaban(payload: FormData):Observable<any> {
        return this.http.post(
            `${this.API_URL}PengisianSmki/savedraftjawaban`,
            payload
        );
    }

    submitJawaban(payload: FormData):Observable<any> {
        return this.http.post(
            `${this.API_URL}PengisianSmki/submitjawaban`,
            payload
        );
    }

    getAttachmentPreviewUrl(id: string):Observable<any> {
        return this.http.get(
            `${this.API_URL}Attachment/preview/${id}`
        );
    }
}

