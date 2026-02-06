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
}