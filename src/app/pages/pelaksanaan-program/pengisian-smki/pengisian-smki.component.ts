import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { PengisianSmkiService } from './pengisian-smki.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-pengisian-smki',
  standalone: true,
  imports: [CommonModule, SharedModule, NgSelectModule, FormsModule, FlatpickrModule, RouterModule],
  templateUrl: './pengisian-smki.component.html',
  styleUrl: './pengisian-smki.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PengisianSmkiComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private pengisianSmkiService: PengisianSmkiService,
    private tokenStorageService: TokenStorageService
  ) {}

  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Pengisian Assesment SMKI', active: true }
    ];
    this.kodeUnitKerja = this.tokenStorageService.getUser().kodeOffice;
    this.loadData();
  }

  programAuditId!: number;

  searchQuery = '';
  entriesPerPage = 10;
  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  isLoading = false;
  filters = {
    page: 1,
    limit: 10,
    search: '',
    programAuditId: null as number | null,
  }
  kodeUnitKerja= '';
  jadwalAudit: any[] = [];

  loadData() {
    this.isLoading = true;
    this.jadwalAudit = [];
    this.pengisianSmkiService.getJadwalAuditByKodeUnitKerja(this.kodeUnitKerja).subscribe({
      next: (res) => {
        this.jadwalAudit = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.isLoading = false;
      }
    });
  }

  // ===================== FILTER =====================
  onSearchChange(): void {
    this.filters.search = this.searchQuery;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadData();
  }

  onEntriesPerPageChange(): void {
    this.filters.limit = this.entriesPerPage;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadData();
  }

  resetFilters(): void {
    this.filters.programAuditId = null;
    this.searchQuery = '';
    this.filters.search = '';
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadData();
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

  trackByFn(item: any) {
    return item.id;
  }
}
