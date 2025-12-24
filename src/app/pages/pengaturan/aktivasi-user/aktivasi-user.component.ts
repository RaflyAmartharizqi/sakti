import { Component, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AktivasiUserService } from './aktivasi-user.service';
import { SharedModule } from "../../../shared/shared.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, switchMap, distinctUntilChanged, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aktivasi-user',
  standalone: true,
  templateUrl: './aktivasi-user.component.html',
  imports: [CommonModule, SharedModule, NgSelectModule, FormsModule],
  styleUrls: ['./aktivasi-user.component.scss']
})

export class AktivasiUserComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  constructor(
    private modalService: NgbModal,
    private aktivasiUserService: AktivasiUserService
  ) {
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      switchMap(term => {
        if (!term || term.length < 3) {
          this.listUserBpjs = [];
          this.isLoading = false;
          return [];
        }
        return this.aktivasiUserService.searchUserBpjs(term);
      })
    ).subscribe({
      next: (res: any) => {
        this.listUserBpjs = res.response ? [...res.response] : [];
        this.isLoading = false;
        console.log("LIST USER:", this.listUserBpjs);
      },
      error: (err) => {
        console.error("Error:", err);
        this.listUserBpjs = [];
        this.isLoading = false;
      }
    });
  }

  activeTab: string = 'bpjs';
  statusFilter: string = '';
  entriesPerPage: number = 10;
  searchQuery: string = '';
  isTabLoading: boolean = false;
  listUserBpjs: any[] = [];
  selectedUserBpjs: any = null;
  isLoading = false;
  searchInput$ = new Subject<string>();
  
  filters = {
    status: '',
    tipeUser: 'bpjs',
    page: 1,
    limit: 10,
    search: '',
  }

  userData = {
    id: null,
    asesorId: [] as number[],
    tipeUser: '',
    nama: '',
    npp: null,
    nik: null,
    unitKerja: null,
    kodeUnitKerja: null,
    email: null,
    status: true
  };

  users: any[] = [];
  asesor: any[] = [];
  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  selectedGrupUser = '';
  selectedAsesor: number = 0;

  // ========== Get Insert Update Data ============
  loadUsers() {
    this.isTabLoading = true;
    this.users = [];   
    this.aktivasiUserService.get(this.filters).subscribe({
      next: (res) => {
        this.users = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.isTabLoading = false;
      }
    });
  }

  getAsesor() { 
    this.aktivasiUserService.getAsesor().subscribe({
      next: (res) => {
        this.asesor = res.response.list;
        console.log(this.asesor);
      }
    });
  }
  
  createUser() {
    if (this.userData.tipeUser === "bpjs") {
      if (!this.selectedUserBpjs || this.userData.asesorId.length === 0) {
          return;
      }
    } else if (this.userData.tipeUser === "eksternal") {
      if (!this.userData.nik ||
          !this.userData.nama ||
          !this.userData.email ||
          !this.userData.asesorId ||
          this.userData.asesorId.length === 0 && this.userData.tipeUser === "eksternal") {
          return;
      }
    }

    this.aktivasiUserService.create(this.userData).subscribe({
      next: (res) => {
        Swal.close();
        Swal.fire({
          title: "Berhasil", 
          text: "User berhasil dibuat", 
          icon: "success",
        });
        this.modalService.dismissAll();
        this.loadUsers();
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

  updateUser() {
    if (this.userData.tipeUser === "bpjs") {
      if (!this.selectedUserBpjs || this.userData.asesorId.length === 0) {
          return;
      }
    } else if (this.userData.tipeUser === "eksternal") {
      if (!this.userData.nik ||
          !this.userData.nama ||
          !this.userData.email ||
          !this.userData.asesorId ||
          this.userData.asesorId.length === 0 && this.userData.tipeUser === "eksternal") {
          return;
      }
    }
    if (!this.userData.id) {
        Swal.fire("Error", "ID user tidak ditemukan.", "error");
        return;
      }
    this.aktivasiUserService.update(this.userData.id, this.userData)
      .subscribe({
        next: (res) => {
          Swal.fire("Sukses", "Data user berhasil diperbarui!", "success");
          this.modalService.dismissAll();
          this.loadUsers();   // reload tabel
        },
        error: (err) => {
          Swal.fire("Error", err.error?.metadata?.message || "Gagal update user", "error");
        }
    });
  }

  // ================ ngOnInit =================

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengaturan' },
      { label: 'Aktivasi User', active: true }
    ];
    this.loadUsers();
    this.getAsesor();
  }

   // ===================== TAB =====================

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.filters.tipeUser = tab;
    this.filters.page = 1;
    this.currentPage = 1;
    this.users = [];
    this.loadUsers();
    this.resetFilters();
  }

  // ===================== FILTER =====================

  onStatusFilterChange(): void {
    // value dari select: '', 'aktif', 'nonaktif'
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadUsers();
  }

  onSearchChange(): void {
    this.filters.search = this.searchQuery;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadUsers();
  }

  onEntriesPerPageChange(): void {
    this.filters.limit = this.entriesPerPage;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadUsers();
  }

  resetFilters(): void {
    this.filters.status = '';
    this.searchQuery = '';
    this.filters.search = '';
    this.filters.page = 1;
    this.currentPage = 1;
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
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filters.page = this.currentPage;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;
      this.filters.page = this.currentPage;
      this.loadUsers();
    }
  }
  
  selectedAsesorId: number | null = null;
  onAsesorChange(asesorId: number | null) {
      if (asesorId) {
        this.userData.asesorId = [asesorId];
      } else {
        this.userData.asesorId = [];
      }
      console.log("Updated asesorId:", this.userData.asesorId);
  }
  
  // ===================== MODAL =====================
  onEditClickBPJS(bpjsModalEdit: TemplateRef<any>, userId: number): void {
    this.aktivasiUserService.getById(userId).subscribe({
      next: (res) => {
        const data = res.response;
        
        this.userData = {
          id: data.id,
          tipeUser: data.tipeUser,
          nama: data.nama,
          npp: data.npp,
          nik: data.nik,
          unitKerja: data.unitKerja,
          email: data.email ?? null,
          kodeUnitKerja: data.kodeUnitKerja,
          asesorId: data.asesor ? data.asesor.map((x:any) => x.id) : [],
          status: data.status
        };
        
        // ✅ Set selectedAsesorId untuk auto-select
        this.selectedAsesorId = this.userData.asesorId.length > 0 
          ? this.userData.asesorId[0] 
          : null;
        
        this.selectedUserBpjs = {
          nama: data.nama,
          npp: data.npp,
          namaunitkerja: data.unitKerja,
          email: data.email
        };

        console.log("asesorId (array):", this.userData.asesorId);
        console.log("selectedAsesorId (single):", this.selectedAsesorId);

        this.modalService.open(bpjsModalEdit, { centered: true });
      },
      error: () => {
        Swal.fire("Error", "Gagal memuat data user.", "error");
      }
    });
  }

  // ✅ Update method onEditClickEksternal
  onEditClickEksternal(eksternalModalEdit: TemplateRef<any>, userId: number): void {
    this.aktivasiUserService.getById(userId).subscribe({
      next: (res) => {
        const data = res.response;
        
        this.userData = {
          id: data.id,
          tipeUser: data.tipeUser,
          nama: data.nama,
          npp: data.npp,
          nik: data.nik,
          unitKerja: data.unitKerja,
          kodeUnitKerja: data.kodeunitKerja,
          email: data.email ?? null,
          asesorId: data.asesor ? data.asesor.map((x:any) => x.id) : [],
          status: data.status
        };

        console.log("asesorId (Eksternal):", this.userData.asesorId);

        this.modalService.open(eksternalModalEdit, { centered: true });
      },
      error: () => {
        Swal.fire("Error", "Gagal memuat data user.", "error");
      }
    });
  }

  openModalPilihan(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  // ✅ Update openModalBpjs
  openModalBpjs(parentModal: any, bpjsModal: TemplateRef<any>) {
    parentModal.close();
    this.resetUserData();
    this.userData.tipeUser = 'bpjs';
    this.selectedAsesorId = null;
    this.modalService.open(bpjsModal, { centered: true });
  }

  // ✅ Update openModalEksternal
  openModalEksternal(parentModal: any, eksternalModal: TemplateRef<any>) {
    parentModal.close();
    this.resetUserData();
    this.userData.tipeUser = 'eksternal';
    this.modalService.open(eksternalModal, { centered: true });
  }


  resetUserData() {
    this.userData = {
      id: null,
      asesorId: [],
      tipeUser: '',
      nama: '',
      npp: null,
      nik: null,
      unitKerja: null,
      kodeUnitKerja: null,
      email: null,
      status: true
    };
    this.selectedAsesorId = null; // ✅ Reset juga
    this.selectedUserBpjs = null;
    this.listUserBpjs = [];
  }

  trackByFn(item: any): any {
    return item ? item.npp : null;
  }

  onSelectUserBpjs(item: any) {
    if (!item) {
      this.userData.nama = '';
      this.userData.npp = null;
      this.userData.unitKerja = null;
      this.userData.email = null;
      return;
    }

    this.userData.nama = item.nama || '';
    this.userData.npp = item.npp || null;
    this.userData.unitKerja = item.namaunitkerja || null;
    this.userData.kodeUnitKerja = item.kodeunitkerja || null,
    this.userData.email = item.email || null;
  }

  checkBoxAsesor(asesorId: number, event: any) {
    if (event.target.checked) {
      if (!this.userData.asesorId.includes(asesorId)) {
        this.userData.asesorId.push(asesorId);
      }
    } else {
      const index = this.userData.asesorId.indexOf(asesorId);
      if (index > -1) {
        this.userData.asesorId.splice(index, 1);
      }
    }
    console.log("Updated asesorId (Eksternal):", this.userData.asesorId);
  }


}