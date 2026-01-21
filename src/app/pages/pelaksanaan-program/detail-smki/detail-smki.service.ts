import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class DetailSmkiService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    getListByBidang(parameters: any):Observable<any> {
        return this.http.get(
            `${this.API_URL}PengisianSmki/getlistbybidang`,
            { 
                params: {
                    jadwalUnitKerjaAuditId: parameters.jadwalUnitKerjaAuditId,
                    kodeBidang: parameters.kodeBidang
                }
            }
        );
    }

}

