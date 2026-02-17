import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UmpanBalikService } from './umpan-balik.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-umpan-balik',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CommonModule,
    SharedModule,
    RouterModule,
    NgSelectModule,
    FormsModule
  ],
  templateUrl: './umpan-balik.component.html',
  styleUrl: './umpan-balik.component.scss'
})
export class UmpanBalikComponent implements OnInit {
  constructor(
      private umpanBalikService: UmpanBalikService,
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Monitoring dan Tindak Lanjut' },
      { label: 'Umpan Balik Assesment' }
    ];
    this.getStandarAssesment();
    this.getPeriode();
  }

  standarAssesment: any[] = [];
  periode: number[] = [];

  filters = {
    standarAssesmentId: null as null | number,
    periode: null as null | number,
  }
  
  getStandarAssesment() {
    this.umpanBalikService.getStandarAssesment().subscribe({
      next: (res) => {
        this.standarAssesment = res.response.list;
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

  downloadExcel() {

    if (!this.filters.standarAssesmentId || !this.filters.periode) {
      alert('Standar Assesment dan Periode wajib dipilih!');
      return;
    }

    this.umpanBalikService
      .exportExcel(this.filters)
      .subscribe({
        next: (response: Blob) => {

          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `Assessment_${this.filters.standarAssesmentId}_${this.filters.periode}.xlsx`;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error(err);
          alert('Gagal download file');
        }
      });
  }


  onFiltersChange() {
    console.log(this.filters);
  }
}
