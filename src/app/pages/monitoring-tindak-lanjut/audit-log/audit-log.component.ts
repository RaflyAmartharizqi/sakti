import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditLogService } from './audit-log.service';
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CommonModule,
    SharedModule,
    FlatpickrModule,
    RouterModule,
    FormsModule,
    NgSelectModule
],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss'
})
export class AuditLogComponent implements OnInit {
  constructor(
      private auditLogService: AuditLogService,
      private tokenStorageService: TokenStorageService
  ) {}
  
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Monitoring dan Tindak Lanjut' },
      { label: 'Audit Log' }
    ];
    this.role = this.tokenStorageService.getUser().role;
    this.loadData();
    this.getStandarAssesment();
    this.getUnitkerja();
    this.getPeriode();
  }

  standarAssesment: any[] = [];
  unitKerja: any[] = [];
  periode: number[] = [];
  isLoading= false;
  auditLog: any[] = [];

  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;

  role= '';

  filters = {
    kodeUnitKerja: null as null | string,
    standarAssesmentId: null as null | number,
    periode: null as null | number,
  }
  
  getStandarAssesment() {
    this.auditLogService.getStandarAssesment().subscribe({
      next: (res) => {
        this.standarAssesment = res.response.list;
      }
    });
  }

  getUnitkerja() {
    this.auditLogService.getUnitKerja().subscribe({
      next: (res) => {
        this.unitKerja = res.response.list;
      }
    });
  }

  getPeriode() {
    const currentYear = new Date().getFullYear() + 1;
    this.periode = [];
    for (let i = currentYear; i >= 2000; i--) {
      this.periode.push(i);
    }
    console.log('HOHO', this.periode);
  }

  loadData() {
    if (this.role == 'Asesi')
    {
      this.filters.kodeUnitKerja = this.tokenStorageService.getUser().kodeOffice;
    }
    this.isLoading = true;
    this.auditLog= [];
    this.auditLogService.getAuditLog(this.filters).subscribe({
      next: (res) => {
        this.auditLog = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.isLoading = false;
        console.log(this.auditLog);
      }
    });
  }

  onFiltersChange() {
    console.log(this.filters);
    this.loadData();
  }

}
