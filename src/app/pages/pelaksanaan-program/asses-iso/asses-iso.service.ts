import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../global-component';

@Injectable({
  providedIn: 'root'
})

export class AssesIsoService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    getRating():Observable<any> {
        return this.http.get(
            `${this.API_URL}Rating/getlist`
        );
    }

    getListPertanyaanIso(transaksiAuditId: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}PelaksanaanIso/getlistpertanyaaniso`,
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

    getBidang(unitKerja: string):Observable<any> {
        return this.http.get(
            `${this.API_URL}Bidang/iso/getlistbykodeparent`,
            { 
                params: {
                    kodeParent: unitKerja,
                }
            }
        );
    }

    saveDraftJawaban(payload: FormData):Observable<any> {
        return this.http.post(
            `${this.API_URL}PelaksanaanIso/savedraftjawaban`,
            payload
        );
    }

    submitJawaban(payload: FormData):Observable<any> {
        return this.http.post(
            `${this.API_URL}PelaksanaanIso/submitjawaban`,
            payload
        );
    }

    getAttachmentPreviewUrl(storedFileName: string):Observable<any> {
        return this.http.get(
            `${this.API_URL}Attachment/preview/${storedFileName}`
        );
    }

}

