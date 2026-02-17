import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../global-component';
import { filter } from 'lodash';
import { param } from 'jquery';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

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

    getAuditLog(params: any):Observable<any> {
        return this.http.get(
            `${this.API_URL}AuditLog/getlistauditlog`,
            {
                params: {
                    KodeUnitKerja: params.kodeUnitKerja ?? '',
                    StandarAssesmentId: params.standarAssesmentId ?? '',
                    Periode: params.periode ?? '',
                }
            }
        );
    }

    getDashboard(params: any):Observable<any> {
        return this.http.get(
            `${this.API_URL}Dashboard/getdashboard`,
            {
                params: {
                    KodeUnitKerja: params.kodeUnitKerja ?? '',
                    StandarAssesmentId: params.standarAssesmentId ?? '',
                    Periode: params.periode ?? '',
                }
            }
        );
    }
}