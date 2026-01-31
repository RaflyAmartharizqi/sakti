import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PenilaianVerifikasiService } from './penilaian-verifikasi.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-penilaian-verifikasi',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule ],
  templateUrl: './penilaian-verifikasi.component.html',
  styleUrl: './penilaian-verifikasi.component.scss'
})
export class PenilaianVerifikasiComponent implements OnInit {
  constructor(
    // private modalService: NgbModal,
    private penilaianVerifikasiService: PenilaianVerifikasiService
  ) {}
  breadCrumbItems!: Array<{}>;
  penilaianSmki: any[] = [];
  isLoading = false;
  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  filters = {
    page: 1,
    limit: 10,
    periode: null as number | null,
    search: ''
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Penilaian atau Verifikasi', active: true }
    ];
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.penilaianSmki = [];
    this.penilaianVerifikasiService.getListPenilaianSmki(this.filters).subscribe({
      next: (res) => {
        this.penilaianSmki = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.isLoading = false;
      }
    });
  }

    // ===================== PAGINATION =====================

  get paginationInfo(): string {
    if (this.totalData === 0) {
      return 'Showing 0 to 0 of 0 entries';
    }
    return `Showing ${this.from} to ${this.to} of ${this.totalData} entries`;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPage;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, -1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, -1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages);
      }
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPage && page !== this.currentPage) {
      this.currentPage = page;
      this.filters.page = page;
      this.loadData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filters.page = this.currentPage;
      this.loadData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;
      this.filters.page = this.currentPage;
      this.loadData();
    }
  }
}
