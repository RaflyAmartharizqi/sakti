import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    getStandarAssesment():Observable<any> {
        return this.http.get(
            `${this.API_URL}StandarAssesment/getlist`,
        );
    }

    getUnitKerja():Observable<any> {
        return this.http.get(
            `${this.API_URL}UnitKerja/getlist`,
        );
    }

    getReportList(param: any):Observable<any> {
        return this.http.get(
            `${this.API_URL}Report/getlist`,
            {
                params: {
                    KodeUnitKerja: param.kodeUnitKerja ?? '',
                    StandarAssesmentId: param.standarAssesmentId ?? '',
                    Periode: param.periode ?? '',
                }
            }
        );
    }

    uploadReport(payload: FormData):Observable<any> {
        return this.http.post(
            `${this.API_URL}Report/uploadreport`,
            payload
        );
    }

    downloadAttachment(id: number) {
        return this.http.get(
            `${this.API_URL}Attachment/download/${id}`,
            {
            responseType: 'blob',
            observe: 'response'
            }
        );
    }

}