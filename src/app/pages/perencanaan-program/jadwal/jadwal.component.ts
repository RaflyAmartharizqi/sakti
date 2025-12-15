import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-jadwal',
  standalone: true,
  imports: [CommonModule, SharedModule, NgSelectModule, FormsModule, FlatpickrModule],
  templateUrl: './jadwal.component.html',
  styleUrl: './jadwal.component.scss'
})
export class JadwalComponent implements OnInit {
    constructor(
    private modalService: NgbModal,
    // private refKlausulAnnexService: ReferensiKlausulAnnexService
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Perencanaan Program' },
      { label: 'Jadwal Audit', active: true }
    ];
  }
  searchQuery = '';
  entriesPerPage = 10;
  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  filters = {
    page: 1,
    limit: 10,
    search: '',
    status: null,
  }

  openModalEditJadwalAudit(editJadwalAudit: TemplateRef<any>) {
    // this.resetData();
    this.modalService.open(editJadwalAudit, { centered: true });
  }

  // ===================== FILTER =====================

  onStatusFilterChange(): void {
    // value dari select: '', 'aktif', 'nonaktif'
    this.filters.page = 1;
    this.currentPage = 1;
    // this.loadUsers();
  }

  onSearchChange(): void {
    this.filters.search = this.searchQuery;
    this.filters.page = 1;
    this.currentPage = 1;
    // this.loadUsers();
  }

  onEntriesPerPageChange(): void {
    this.filters.limit = this.entriesPerPage;
    this.filters.page = 1;
    this.currentPage = 1;
    // this.loadUsers();
  }

  resetFilters(): void {
    this.filters.status = null;
    this.searchQuery = '';
    this.filters.search = '';
    this.filters.page = 1;
    this.currentPage = 1;
    // this.loadUsers();
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
      // this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filters.page = this.currentPage;
      // this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;
      this.filters.page = this.currentPage;
      // this.loadUsers();
    }
  }
  
  selectedAsesorId: number | null = null;
}
