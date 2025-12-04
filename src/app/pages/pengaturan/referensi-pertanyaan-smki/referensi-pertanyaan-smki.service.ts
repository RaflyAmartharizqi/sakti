import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class ReferensiPertanyaanSmkiService {
    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    create(payload: any) {
        return this.http.post(
            this.API_URL + 'RefKlausulAnnex/insert',
            payload,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                })
            }
        );
    }

    getSmkiBidang():Observable<any> {
        return this.http.get(
            `${this.API_URL}BidangSmki/getlist`
        );
    }

    getStandarKalusulAnnex():Observable<any> {
        return this.http.get(
            `${this.API_URL}RefKlausulAnnex/getstandar`
        );
    }

    getRefKlausulAnnexByStandar(standar: string):Observable<any> {
        return this.http.get(
            `${this.API_URL}RefKlausulAnnex/getbystandar/${standar}`
        );
    }

    update(id: number, payload: any) {
        return this.http.put(
            this.API_URL + `RefKlausulAnnex/update/${id}`,
            payload,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                })
            }
        );
    }

    getById(id: number):Observable<any> {
        return this.http.get(
            `${this.API_URL}RefKlausulAnnex/getbyid/${id}`,
        );
    }

}

