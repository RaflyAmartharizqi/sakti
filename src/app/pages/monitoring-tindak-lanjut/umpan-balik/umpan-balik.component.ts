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

  onFiltersChange() {
    console.log(this.filters);
  }
}
