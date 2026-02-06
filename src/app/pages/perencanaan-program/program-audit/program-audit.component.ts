import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ProgramAudit } from './program-audit.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-program-audit',
  standalone: true,
  imports: [CommonModule, SharedModule, NgSelectModule, FormsModule, RouterModule, FlatpickrModule ],
  templateUrl: './program-audit.component.html',
  styleUrl: './program-audit.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProgramAuditComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private programAuditService: ProgramAudit
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Perencanaan Program' },
      { label: 'Program Audit', active: true }
    ];
    this.loadData();
    this.getStandarAssesment();
    this.getUnitkerja();
    this.getPeriode();
  }
  tahun: any;
  searchQuery = '';
  entriesPerPage = 10;
  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  filters = {
    periode: null,
    page: 1,
    limit: 10,
    search: '',
  }

  isLoading= false;
  standarAssesment: any[] = [];
  programAuditId= 0;
  jenisAudit = '';
  programAuditData = {
    id: null,
    standarAssesmentId: null,
    kodeUnitKerja: [],
    periode: null,
  }
  programAudit: any[] = [];
  unitKerjaAll: any[] = [];
  unitKerja: any[] = [];
  periode: number[] = [];

  getStandarAssesment() {
    this.programAuditService.getStandarAssesment().subscribe({
      next: (res: any) => {
        this.standarAssesment = res.response.list;
      },
      error: (err) => console.error(err)
    });
  }

  getUnitkerja() {
    this.programAuditService.getUnitKerjaByJenisAudit().subscribe({
      next: (res: any) => {
        this.unitKerjaAll = res.response.list;
        console.log(this.unitKerjaAll);
      },
      error: (err) => console.error(err)
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

  create() {
    if (!this.programAuditData.periode ||
        !this.programAuditData.standarAssesmentId ||
        this.programAuditData.kodeUnitKerja.length == 0) {
        return;
    }
    console.log(this.programAuditData);
    this.programAuditService.create(this.programAuditData).subscribe({
      next: (res) => {
        Swal.close();
        Swal.fire({
          title: "Berhasil", 
          text: "Program Audit Berhasil Dibuat", 
          icon: "success",
        });
        this.modalService.dismissAll();
        this.loadData();
      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          title: "Error",
          text: err.error?.metadata?.message || "Terjadi kesalahan",
          icon: "error"
        });
      }
    });
  }

  loadData() {
    this.isLoading = true;
    this.programAudit= [];
    this.programAuditService.get(this.filters).subscribe({
      next: (res) => {
        this.programAudit = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.isLoading = false;
      }
    });
  }

  update() {
    if (!this.programAuditData.periode ||
        !this.programAuditData.standarAssesmentId ||
        this.programAuditData.kodeUnitKerja.length == 0) {
        return;
    }
    if (!this.programAuditData.id) {
      Swal.fire("Error", "Program audit tidak ditemukan.", "error");
      return;
    }
    console.log(this.programAuditData);
    this.programAuditService.update(this.programAuditData.id, this.programAuditData).subscribe({
      next: (res) => {
        Swal.close();
        Swal.fire({
          title: "Berhasil", 
          text: "Program Audit Berhasil Diupdate", 
          icon: "success",
        });
        this.modalService.dismissAll();
        this.loadData();
      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          title: "Error",
          text: err.error?.metadata?.message || "Terjadi kesalahan",
          icon: "error"
        });
      }
    });
  }

  onEditClickProgramAudit(updateProgramAuditModal: TemplateRef<any>, id: number): void {
    this.resetData();
    this.programAuditService.getById(id).subscribe({
      next: (res: any) => {
        const data = res.response;

        this.selectedStandar = this.standarAssesment.find(
          x => x.id === data.standarAssesmentId
        );

        this.onStandarChange();

        this.programAuditData = {
          id: data.id,
          standarAssesmentId: data.standarAssesmentId,
          kodeUnitKerja: data.unitKerja?.map((x: any) => x.kodeUnitKerja) ?? [],
          periode: data.periode,
        };
        this.modalService.open(updateProgramAuditModal, { centered: true });
      }
    });
  }


  selectedStandar: any = null;

  onStandarChange() {
    if (!this.selectedStandar) return;
    
    this.programAuditData.standarAssesmentId = this.selectedStandar.id;
    const kode = this.selectedStandar.kode;
    this.programAuditData.kodeUnitKerja = [];
    setTimeout(() => {
      if (kode === "SMKI") {
        this.unitKerja = this.unitKerjaAll
          .filter(x => x.jenis === 'KEPWIL' || x.jenis === 'KC');
      } else {
        this.unitKerja = this.unitKerjaAll
          .filter(x => x.jenis === 'UKPF');
      }
    }, 0);
  }

  trackByFn(item: any) {
    return item.id;
  }

  resetData() {
    this.programAuditData = {
      id: null,
      standarAssesmentId: null,
      kodeUnitKerja: [],
      periode: null,
    }
  }

  openModalTambahProgramAudit(tambahProgramAudit: TemplateRef<any>) {
    this.resetData();
    this.modalService.open(tambahProgramAudit, { centered: true });
  }

    // ===================== FILTER =====================

  onPeriodeFilterChange(): void {
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadData();
  }

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
    this.filters.periode = null;
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
