import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { JadwalAuditService } from './jadwal-audit.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface UnitKerja {
  id: number;
  nama: string;
  kodeGrupUnitKerja: string;
};

@Component({
  selector: 'app-jadwal-audit',
  standalone: true,
  imports: [CommonModule, SharedModule, NgSelectModule, FormsModule, FlatpickrModule],
  templateUrl: './jadwal-audit.component.html',
  styleUrl: './jadwal-audit.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class JadwalAuditComponent implements OnInit {
  programAuditId!: number;
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private jadwalAuditService: JadwalAuditService
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Perencanaan Program' },
      { label: 'Jadwal Audit', active: true }
    ];
    this.route.paramMap.subscribe(params => {
      this.filters.programAuditId = Number(params.get('programAuditId'));
      this.loadData();
    });
  }
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
  kodeJenisAudit= '';
  jadwalAudit: any[] = [];
  isoForm = {
    jadwalAuditId: null as number | null,
    kategoriProgram: null as string | null,
    tanggalMulai: null as string | null,
    tanggalSelesai: null as string | null,
    userIdKetua: null as number | null,
    unitKerja: [] as any[],
    timAsesor: [] as number[],
    rangeTanggal: '' as string
  };


  smkiForm = {
    jadwalUnitKerjaAuditId: null as number | null,
    tanggalMulai: null as string | null,
    tanggalSelesai: null as string | null,
    userIdKetua: null as number | null,
    unitKerja: [] as any[],
    timAsesor: [] as number[],
    rangeTanggal: '' as string
  };

  kodeUnitKerja= [];
  users: any[] = [];
  usersFiltered: any[] = [];

  unitKerja: UnitKerja[] = [];

  onEditClickJadwalAuditIso(updateJadwalAuditIsoModal: TemplateRef<any>, id: number): void {
    this.jadwalAuditService.getEditIso(id).subscribe(res => {
      const ketuaId = Number(res.response.jadwalAudit.userIdKetua);
      this.isoForm = {
        jadwalAuditId: res.response.jadwalAudit.jadwalAuditId,
        kategoriProgram: res.response.jadwalAudit.kategoriProgram,
        tanggalMulai: res.response.jadwalAudit.tanggalMulai,
        tanggalSelesai: res.response.jadwalAudit.tanggalSelesai,
        userIdKetua: ketuaId,
        unitKerja: res.response.unitKerja,
        timAsesor: res.response.timAsesor.map((x: any) => x.userId),
        rangeTanggal: `${res.response.jadwalAudit.tanggalMulai} to ${res.response.jadwalAudit.tanggalSelesai}`
      };
      this.kodeUnitKerja = res.response.unitKerja?.map((x: any) => x.kodeUnitKerja) ?? [];
      this.getUnitkerja();
      this.getListUserByAsesor(this.kodeJenisAudit);
      console.log(this.kodeUnitKerja);
            console.log(this.unitKerja);
      this.modalService.open(updateJadwalAuditIsoModal, { centered: true });
    });
  }

  onEditClickJadwalAuditSmki(updateJadwalAuditSmkiModal: TemplateRef<any>, id: number): void {
    console.log("HOHO", this.smkiForm.jadwalUnitKerjaAuditId);
    this.jadwalAuditService.getEditSmki(id).subscribe(res => {
      this.smkiForm = {
        jadwalUnitKerjaAuditId: res.response.jadwalAudit.jadwalUnitKerjaAuditId,
        tanggalMulai: res.response.jadwalAudit.tanggalMulai,
        tanggalSelesai: res.response.jadwalAudit.tanggalSelesai,
        userIdKetua: res.response.jadwalAudit.userIdKetua,
        unitKerja: res.response.jadwalAudit.unitKerja,
        timAsesor: res.response.timAsesor.map((x: any) => x.userId),
        rangeTanggal: `${res.response.jadwalAudit.tanggalMulai} to ${res.response.jadwalAudit.tanggalSelesai}`
      };
      this.getListUserByAsesor(this.kodeJenisAudit);
      this.modalService.open(updateJadwalAuditSmkiModal, { centered: true });
    });
  }

  onKetuaTimChange() {
    this.filterTimAsesor();
      if (this.isoForm.timAsesor?.length) {
        this.isoForm.timAsesor = this.isoForm.timAsesor
          .filter((id: number) => id !== this.isoForm.userIdKetua);
      } else if (this.smkiForm.timAsesor?.length) {
        this.smkiForm.timAsesor = this.smkiForm.timAsesor
          .filter((id: number) => id !== this.smkiForm.userIdKetua);
      }
  }

  filterTimAsesor() {
    if (this.kodeJenisAudit === 'ISO')
    {
      this.usersFiltered = this.users.map(u => ({
        ...u,
        disabled: u.id === this.isoForm.userIdKetua
      }));
    } else if (this.kodeJenisAudit === 'SMKI') {
      this.usersFiltered = this.users.map(u => ({
        ...u,
        disabled: u.id === this.smkiForm.userIdKetua
      }));
    }

  }

  onDateRangeChange() {
    if (this.isoForm.rangeTanggal) {
      const dates = this.isoForm.rangeTanggal.split(' to ');
      this.isoForm.tanggalMulai = dates[0] || '';
      this.isoForm.tanggalSelesai = dates[1] || '';
    }
  }

  getUnitkerja() {
    this.jadwalAuditService.getUnitKerjaByJenisAudit().subscribe({
      next: (res: any) => {
        this.unitKerja = res.response.list;
        console.log(this.unitKerja);
      },
      error: (err) => console.error(err)
    });
  }

  getListUserByAsesor(kode: string) {
    this.jadwalAuditService.getListUserByAsesor(kode).subscribe({
      next: (res: any) => {
        this.users = res.response.list;
        this.isoForm.userIdKetua = Number(this.isoForm.userIdKetua);
        this.filterTimAsesor();
      },
      error: (err) => console.error(err)
    });
  }
  
  loadData() {
    this.isLoading = true;
    this.jadwalAudit= [];
    this.jadwalAuditService.get(this.filters).subscribe({
      next: (res) => {
        this.jadwalAudit = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.kodeJenisAudit = res.response.kodeJenisAudit;
        this.isLoading = false;
      }
    });
  }

  updateIso() {
    if (!this.isoForm.jadwalAuditId || !this.isoForm.rangeTanggal || !this.isoForm.userIdKetua) {
      console.log("HAHA", this.isoForm)
      return;
    }
    
    // Parse rangeTanggal jika ada
    if (this.isoForm.rangeTanggal) {
      const dates = this.isoForm.rangeTanggal.split(' to ');
      this.isoForm.tanggalMulai = dates[0] || null;
      this.isoForm.tanggalSelesai = dates[1] || null;
    }

    // Validasi tanggal
    if (!this.isoForm.tanggalMulai || !this.isoForm.tanggalSelesai) {
      Swal.fire("Error", "Tanggal mulai dan selesai harus diisi", "error");
      return;
    }

    this.jadwalAuditService.updateIso(this.isoForm).subscribe({
      next: () => {
        Swal.fire("Berhasil", "Jadwal Audit Berhasil Diupdate", "success");
        this.modalService.dismissAll();
        this.loadData();
      },
      error: (err) => {
        Swal.fire("Error", err.error?.metadata?.message || "Terjadi kesalahan", "error");
      }
    });
  }

  updateSmki() {
    if (!this.smkiForm.jadwalUnitKerjaAuditId || !this.smkiForm.rangeTanggal || !this.smkiForm.userIdKetua) {
      console.log("HAHA", this.smkiForm)
      return;
    }
    
    // Parse rangeTanggal jika ada
    if (this.smkiForm.rangeTanggal) {
      const dates = this.smkiForm.rangeTanggal.split(' to ');
      this.smkiForm.tanggalMulai = dates[0] || null;
      this.smkiForm.tanggalSelesai = dates[1] || null;
    }

    // Validasi tanggal
    if (!this.smkiForm.tanggalMulai || !this.smkiForm.tanggalSelesai) {
      Swal.fire("Error", "Tanggal mulai dan selesai harus diisi", "error");
      return;
    }

    this.jadwalAuditService.updateSmki(this.smkiForm).subscribe({
      next: () => {
        Swal.fire("Berhasil", "Jadwal Audit Berhasil Diupdate", "success");
        this.modalService.dismissAll();
        this.loadData();
      },
      error: (err) => {
        Swal.fire("Error", err.error?.metadata?.message || "Terjadi kesalahan", "error");
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
