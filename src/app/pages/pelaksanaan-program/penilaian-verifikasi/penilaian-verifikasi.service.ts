import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from '../../../../app/global-component';
import { filter } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class PenilaianVerifikasiService {

    private API_URL = GlobalComponent.API_URL;

    constructor(private http: HttpClient) {}

    getListPenilaianSmki(filters: any):Observable<any> {
        return this.http.get(
            `${this.API_URL}PenilaianVerifikasi/getlistpenilaiansmki`,
            { 
                params: {
                    periode: filters.periode ?? null,
                    search: filters.search ?? '',
                    limit: filters.limit ?? 10,
                    page: filters.page ?? 1,
                }
            }
        );
    }
}

