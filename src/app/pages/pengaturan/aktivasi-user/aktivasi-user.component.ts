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

  filters = {
    status: '',
    tipeUser: 'bpjs',
    page: 1,
    limit: 10,
    search: '',
  }

  userData = {
    tipeUser: '',
    nama: '',
    npp: null,
    nik: null,
    unitKerja: null,
    email: null,
    asesorSmki: false,
    asesorIso: false,
    status: true
  };

  users: any[] = [];
  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  selectedGrupUser = '';
  
  onSelectGrupUser(event: any) {
    const value = event.target.value;

    if (value === "smki") {
      this.userData.asesorSmki = true;
      this.userData.asesorIso = false;
    } else if (value === "iso") {
      this.userData.asesorSmki = false;
      this.userData.asesorIso = true;
    }

    console.log(this.userData);
  }

  loadUsers() {
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

  createUser() {
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
        console.log("=== ERROR ===");
        console.log("HTTP STATUS:", err.status);
        console.log("BODY:", err.error);
        console.log("MSG:", err.error?.metadata?.message);
        Swal.close();
        Swal.fire({
          title: "Error",
          text: err.error?.metadata?.message || "Terjadi kesalahan",
          icon: "error"
        });
      }
    });
  }




ngOnInit(): void {
  this.breadCrumbItems = [
    { label: 'Pengaturan' },
    { label: 'Aktivasi User', active: true }
  ];
  this.loadUsers();
}

   // ===================== TAB =====================

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.filters.tipeUser = tab;
    this.filters.page = 1;
    this.currentPage = 1;
    this.users = [];

    // 2. Set loading agar UI nunjukin spinner
    this.isTabLoading = true;
    this.loadUsers();
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
    this.loadUsers();
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

  // ===================== MODAL =====================

  onEditClickBPJS(bpjsModal: TemplateRef<any>): void {
    this.modalService.open(bpjsModal, { centered: true });
  }

  onEditClickEksternal(eksternalModal: TemplateRef<any>): void {
    this.modalService.open(eksternalModal, { centered: true });
  }

  openModalPilihan(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  resetUserData() {
  this.userData = {
    tipeUser: '',
    nama: '',
    npp: null,
    nik: null,
    unitKerja: null,
    email: null,
    asesorSmki: false,
    asesorIso: false,
    status: true
  };
  this.selectedUserBpjs = null;
  this.listUserBpjs = [];
}

  openModalBpjs(parentModal: any, bpjsModal: TemplateRef<any>) {
    parentModal.close();
    this.resetUserData();
    this.userData.tipeUser = 'bpjs';
    this.modalService.open(bpjsModal, { centered: true });
  }

  openModalEksternal(parentModal: any, eksternalModal: TemplateRef<any>) {
    parentModal.close();
    this.resetUserData();
    this.userData.tipeUser = 'eksternal';
    this.modalService.open(eksternalModal, { centered: true });
  }

  listUserBpjs: any[] = [];
  selectedUserBpjs: any = null;
  isLoading = false;
  searchInput$ = new Subject<string>();

 trackByFn(item: any): any {
    return item ? item.npp : null;
  }

onSelectUserBpjs(item: any) {
  console.log("=== DEBUG SELECT ===");
  console.log("Item yang dipilih:", item);
  console.log("namaunitkerja dari item:", item?.namaunitkerja);
  
  if (!item) {
    // Clear data jika tidak ada yang dipilih
    this.userData.nama = '';
    this.userData.npp = null;
    this.userData.unitKerja = null;
    this.userData.email = null;
    return;
  }

  // Isi userData dengan data yang dipilih
  this.userData.nama = item.nama || '';
  this.userData.npp = item.npp || null;
  this.userData.unitKerja = item.namaunitkerja || null;
  this.userData.email = item.email || null;
  
  console.log("userData setelah diisi:", this.userData);
  console.log("userData.unitKerja:", this.userData.unitKerja);
}

}