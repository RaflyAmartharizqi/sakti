import { Component, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface UserBPJS {
  no: number;
  nama: string;
  npp: string;
  unitKerja: string;
  grupUser: string;
  status: string;
}

interface UserEksternal {
  no: number;
  nama: string;
  nik: string;  
  email: string;
  hakAkses: string;
  status: string;
}

@Component({
  selector: 'app-aktivasi-user',
  templateUrl: './aktivasi-user.component.html',
  styleUrl: './aktivasi-user.component.scss'
})

export class AktivasiUserComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  constructor(private modalService: NgbModal) {}

  activeTab: string = 'bpjs';
  statusFilter: string = '';
  entriesPerPage: number = 10;
  searchQuery: string = '';
  currentPage: number = 1;

  usersBPJS: UserBPJS[] = [
    {
      no: 1,
      nama: 'Muhammad Adhan Ramadhan',
      npp: '10277',
      unitKerja: 'Kedeputian Bidang SPPTI',
      grupUser: 'Asesor',
      status: 'Aktif'
    },
    {
      no: 2,
      nama: 'Difka Sairia Akbar',
      npp: '10177',
      unitKerja: 'Kedeputian Bidang SPPTI',
      grupUser: 'Asesor',
      status: 'Aktif'
    },
    {
      no: 3,
      nama: 'Fitri Juwita Adelia',
      npp: '10333',
      unitKerja: 'Kantor Cabang Palembang',
      grupUser: 'Asesor',
      status: 'Aktif'
    },
        {
      no: 4,
      nama: 'Ferran Torres',
      npp: '10177',
      unitKerja: 'Kedeputian Bidang SPPTI',
      grupUser: 'Asesor',
      status: 'Tidak Aktif'
    },
  ];

  usersEksternal: UserEksternal[] = [
    {
      no: 1,
      nama: 'Max Verstappen',
      nik: '718263187192',
      email: 'max@bpjs.com',
      hakAkses: 'Asesor',
      status: 'Aktif'
    },
    {
      no: 1,
      nama: 'Lamine',
      nik: '761267176',
      email: 'lamine@bpjs.com',
      hakAkses: 'Asesor',
      status: 'Aktif'
    }
  ];

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengaturan' },
      { label: 'Aktivasi User', active: true }
    ];
  }

  switchTab(tab: string):void {
    this.activeTab = tab;
    this.resetFilters();
  }

  get filteredUsersBPJS(): UserBPJS[] {
    return this.usersBPJS.filter(user => {
      const matchesStatus = !this.statusFilter || user.status.toLowerCase() === this.statusFilter.toLowerCase();
      const matchesSearch = !this.searchQuery ||
        user.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.npp.includes(this.searchQuery) ||
        user.unitKerja.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.grupUser.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }

  get paginatedUsersBPJS(): UserBPJS[] {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    return this.filteredUsersBPJS.slice(startIndex, endIndex);
  }

  get filteredUsersEksternal(): UserEksternal[] {
    return this.usersEksternal.filter(user => {
      const matchesStatus = !this.statusFilter || user.status.toLowerCase() === this.statusFilter.toLowerCase();
      const matchesSearch = !this.searchQuery ||
        user.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.nik.includes(this.searchQuery) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.hakAkses.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  get paginatedUsersEksternal(): UserEksternal[] {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    return this.filteredUsersEksternal.slice(startIndex, endIndex);
  }


  get totalPages(): number {
    const totalItems = this.activeTab === 'bpjs' ? this.filteredUsersBPJS.length : this.filteredUsersEksternal.length;
    return Math.ceil(totalItems / this.entriesPerPage);
  }

  get paginationInfo(): string {
    const filtered = this.activeTab === 'bpjs' ? this.filteredUsersBPJS : this.filteredUsersEksternal;
    if (filtered.length === 0) return 'Showing 0 to 0 of 0 entries';

    const startIndex = (this.currentPage - 1) * this.entriesPerPage + 1;
    const endIndex = Math.min(this.currentPage * this.entriesPerPage, filtered.length);
    return `Showing ${startIndex} to ${endIndex} of ${filtered.length} entries`;
  }

  get pageNumbers(): number[] {
    const pages = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      for(let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, -1, totalPages);
      } else if (currentPage >= totalPages -2) {
        pages.push(1, -1, totalPages -3, totalPages - 2, totalPages -1, totalPages);
      } else {
        pages.push(1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages);
      }
    }
    return pages;
  }
    // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  // Filter methods
  onStatusFilterChange(): void {
    this.currentPage = 1;
  }
  
  onEntriesPerPageChange(): void {
    this.currentPage = 1;
  }
  
  onSearchChange(): void {
    this.currentPage = 1;
  }
  
  resetFilters(): void {
    this.statusFilter = '';
    this.searchQuery = '';
    this.currentPage = 1;
  }
  
  onTambahClick(): void {
    console.log('Tambah user clicked');
  }
  
  onEditClickBPJS(user: UserBPJS, bpjsModal: TemplateRef<any>): void {
    this.modalService.open(bpjsModal, { centered: true });
  }

  onEditClickEksternal(user: UserEksternal, eksternalModal: TemplateRef<any>): void {
    this.modalService.open(eksternalModal, { centered: true });
  }

  // Modal utama
  openModalPilihan(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  // Modal BPJS
  openModalBpjs(parentModal: any, bpjsModal: TemplateRef<any>) {
    parentModal.close();
    this.modalService.open(bpjsModal, { centered: true });
  }

  // Modal Eksternal
  openModalEksternal(parentModal: any, eksternalModal: TemplateRef<any>) {
    parentModal.close();
    this.modalService.open(eksternalModal, { centered: true });
  }

}
