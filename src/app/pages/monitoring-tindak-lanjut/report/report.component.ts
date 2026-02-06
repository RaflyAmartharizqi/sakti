import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportService } from './report.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CommonModule,
    SharedModule,
    FormsModule,
    FlatpickrModule,
    RouterModule,  
    NgSelectModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  constructor(
      private reportService: ReportService,
  ) {}

  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
      console.log('🔥 ngOnInit DIPANGGIL');
    this.breadCrumbItems = [
      { label: 'Monitoring dan Tindak Lanjut' },
      { label: 'Report' }
    ];
  }

  standarAssesment: any[] = [];
  unitKerja: any[] = [];
  periode: number[] = [];

  filters = {
    kodeUnitKerja: null as null | string,
    standarAssesmentId: null as null | number,
    periode: null as null | number,
  }
  
  getStandarAssesment() {
    this.reportService.getStandarAssesment().subscribe({
      next: (res) => {
        this.standarAssesment = res.response.list;
      }
    });
  }

  getUnitKerja() {
    this.reportService.getUnitKerja().subscribe({
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

  onFiltersChange() {
    console.log(this.filters);
  }
}
