import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { DashboardService } from './dashboard.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private tokenStorageService: TokenStorageService,
  ) {}

  breadCrumbItems!: Array<{}>;
  role = '';

  // ================= FILTER =================
  periode: any[] = [];
  standarAssesment: any[] = [];
  unitKerja: any[] = [];

  filters = {
    kodeUnitKerja: null as null | string,
    standarAssesmentId: null as null | number,
    periode: null as null | number,
  };

  // ================= SUMMARY =================
  totalAudit = 0;
  totalConformity = 0;
  totalNonConformity = 0;
  totalOfi = 0;

  // ================= CHART =================
  doughnutChartType: 'doughnut' = 'doughnut';

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Conformity', 'Non Conformity', 'OFI'],
    datasets: [
      {
        data: [this.totalConformity, this.totalNonConformity, this.totalOfi], // default supaya chart tidak kosong
        backgroundColor: ['#6c7bd9', '#63c58b', '#3bb2a5'],
        borderWidth: 0
      }
    ]
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  // ================= INIT =================
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', active: true }];
    this.role = this.tokenStorageService.getUser().role;
    if (this.role == 'Asesi')
    {
      const user = this.tokenStorageService.getUser();
      if (user.kodeOffice != '00')
      {
        this.filters.kodeUnitKerja = user.kodeOffice;
      } else if (user.kodeOffice == '00') {
        this.filters.kodeUnitKerja = null;
      }
    }
    this.getUnitkerja();
    this.getStandarAssesment();
    this.getPeriode();
    this.loadData();
  }

  // ================= LOAD DATA =================
  loadData() {
    this.dashboardService.getDashboard(this.filters).subscribe({
      next: (res) => {
        const data = res.response;

        this.totalAudit = data?.totalAudit ?? 0;
        this.totalConformity = data?.totalConformity ?? 0;
        this.totalNonConformity = data?.totalNonConformity ?? 0;
        this.totalOfi = data?.totalOfi ?? 0;
        this.doughnutChartData = {
          labels: ['Conformity', 'Non Conformity', 'OFI'],
          datasets: [
            {
              data: [
                this.totalConformity,
                this.totalNonConformity,
                this.totalOfi
              ],
              backgroundColor: ['#6c7bd9', '#63c58b', '#3bb2a5'],
              borderWidth: 0
            }
          ]
        };
      }
    });
  }

  getStandarAssesment() {
    this.dashboardService.getStandarAssesment().subscribe({
      next: (res) => {
        this.standarAssesment = [
        { id: null, nama: 'Semua Kategori Program' },
        ...res.response.list
      ];
      }
    });
  }

  getUnitkerja() {
    this.dashboardService.getUnitKerja().subscribe({
      next: (res) => {
        this.unitKerja = [
        { kode: null, nama: 'Semua Unit Kerja' },
        ...res.response.list
      ];
      }
    });
  }

  get isEmptyChart(): boolean {
    return (
      this.totalConformity === 0 &&
      this.totalNonConformity === 0 &&
      this.totalOfi === 0
    );
  }

  get isUnitKerjaDisabled(): boolean {
    return this.role === 'Asesi' && this.filters.kodeUnitKerja !== null;
  }



  getPeriode() {
  const currentYear = new Date().getFullYear() + 1;

    this.periode = [
      { id: null, nama: 'Semua Periode' }
    ];

    for (let i = currentYear; i >= 2000; i--) {
      this.periode.push({
        id: i,
        nama: i.toString()
      });
    }
  }


  onFiltersChange() {
    this.loadData();
  }
}
