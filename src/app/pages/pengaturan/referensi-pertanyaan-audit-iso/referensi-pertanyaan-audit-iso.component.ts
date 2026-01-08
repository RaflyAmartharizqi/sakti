import { Component, OnInit, AfterViewInit, TemplateRef, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferensiPertanyaanAuditIso } from './referensi-pertanyaan-audit-iso.service';
import Swal from 'sweetalert2';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-referensi-pertanyaan-audit-iso',
  templateUrl: './referensi-pertanyaan-audit-iso.component.html',
  styleUrl: './referensi-pertanyaan-audit-iso.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ReferensiPertanyaanAuditIsoComponent {
  breadCrumbItems!: Array<{}>;
  constructor(
    private modalService: NgbModal,
    private refPertanyaanAuditIsoService: ReferensiPertanyaanAuditIso
  ) {}

  entriesPerPage: number = 10;
  searchQuery: string = '';
  isLoading: boolean = false;
  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  bidangIso: any[] = [];
  refPertanyaanIso: any[] = [];
  refKlausulAnnex: any[] = [];
  standarAssesment: any[] = [];
  selectedBidang: string[] = [];
  selectedStandar= null;
  refPertanyaanIsoData = {
    id: null,
    refKlausulAnnexId: null,
    jenisAuditId: 2,
    pertanyaan: '',
    hasilYangDiharapkan: '',
    kodeBidang: [] as number[],
    status: true
  };

  filters = {
    page: 1,
    limit: 10,
    search: '',
    status: null,
  }

  
  resetData() {
    this.refPertanyaanIsoData = {
      id: null,
      refKlausulAnnexId: null,
      jenisAuditId: 2,
      pertanyaan: '',
      hasilYangDiharapkan: '',
      status: true,
      kodeBidang: []
    };
    this.selectedStandar = null;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengaturan' },
      { label: 'Referensi Pertanyaan Audit ISO', active: true }
    ];
    this.loadData();
    this.getBidangIso();
    this.getStandarAssesment();
  }

  onEditClickReferensiPertanyaanAuditIso(updateReferensiPertanyaanAuditIsoModal: TemplateRef<any>, id: number): void {
    this.resetData();
    this.refPertanyaanAuditIsoService.getById(id).subscribe({
      next: (res: any) => {
        const data = res.response;

        this.refPertanyaanIsoData = {
          id: data.id,
          refKlausulAnnexId: data.refKlausulAnnexId,
          jenisAuditId: data.jenisAuditId,
          pertanyaan: data.pertanyaan,
          hasilYangDiharapkan: data.hasilYangDiharapkan,
          status: data.status == 1,
          kodeBidang: data.bidang?.map((x:any) => x.kode) ?? []
        };
        this.selectedStandar = data.standarAssesmentId;
        this.getRefKlausulAnnexByStandar(data.standarAssesmentId);
        this.modalService.open(updateReferensiPertanyaanAuditIsoModal, { centered: true });
      },
      error: (err) => {
        console.error(err);
        Swal.fire("Error", "Gagal memuat data pertanyaan SMKI.", "error");
      }
    });
  }

  openModalReferensiPertanyaanAuditIso(referensiPertanyaanAuditIsoModal: TemplateRef<any>) {
    this.resetData();
    this.modalService.open(referensiPertanyaanAuditIsoModal, { centered: true });
  }

  onStandarChange() {
    console.log("Data select standar", this.selectedStandar);
    if (!this.selectedStandar) return;
    this.getRefKlausulAnnexByStandar(this.selectedStandar);
  }

  getStandarAssesment() {
    this.refPertanyaanAuditIsoService.getStandarAssesment().subscribe({
      next: (res: any) => {
        this.standarAssesment = res.response.list.filter((x: any) => x.kode !== 'SMKI');
      },
      error: (err) => console.error(err)
    });
  }

  getRefKlausulAnnexByStandar(selectedStandar: number) {
    this.refPertanyaanAuditIsoService.getRefKlausulAnnexByStandar(selectedStandar).subscribe({
      next: (res: any) => {
        this.refKlausulAnnex = res.response.list;
        console.log("Hasil klausul annex", this.refKlausulAnnex)
      },
      error: (err) => console.error(err)
    });
  }
  
  getBidangIso() {
    this.refPertanyaanAuditIsoService.getBidangIso().subscribe({
      next: (res) => {

        const list = res.response.list;

        this.bidangIso = list.map((x: any) => ({
          namaGroups: x.namaParent,
          nama: x.nama,
          value: x.kode
        }));

        console.log("Hasil Dropdown:", this.bidangIso);
      }
    });
  }

  loadData() {
    this.isLoading = true;
    this.refPertanyaanIso = [];
    this.refPertanyaanAuditIsoService.get(this.filters).subscribe({
      next: (res) => {
        this.refPertanyaanIso = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.isLoading = false;
      }
    });
  }
  
  create() {
    if (!this.refPertanyaanIsoData.refKlausulAnnexId ||
        !this.refPertanyaanIsoData.pertanyaan ||
        !this.refPertanyaanIsoData.hasilYangDiharapkan ||
        this.refPertanyaanIsoData.kodeBidang.length == 0) {
        return;
    }
    const payload = {
      ...this.refPertanyaanIsoData,
      status: this.refPertanyaanIsoData.status ? 1 : 0
    };
    this.refPertanyaanAuditIsoService.create(payload).subscribe({
      next: (res) => {
        Swal.close();
        Swal.fire({
          title: "Berhasil", 
          text: "User berhasil dibuat", 
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

  update() {
    if (!this.refPertanyaanIsoData.refKlausulAnnexId ||
        !this.refPertanyaanIsoData.pertanyaan ||
        !this.refPertanyaanIsoData.hasilYangDiharapkan ||
        this.refPertanyaanIsoData.kodeBidang.length == 0) {
        return;
    }
    if (!this.refPertanyaanIsoData.id) {
      Swal.fire("Error", "ID Referensi Pertanyaan tidak ditemukan.", "error");
      return;
    }

    const payload = {
      ...this.refPertanyaanIsoData,
      status: this.refPertanyaanIsoData.status ? 1 : 0
    };

    console.log("UPDATE PAYLOAD:", payload);

    this.refPertanyaanAuditIsoService.update(this.refPertanyaanIsoData.id, payload)
      .subscribe({
        next: (res) => {
          Swal.fire("Sukses", "Data berhasil diperbarui!", "success");
          this.modalService.dismissAll();
          this.loadData();
        },
        error: (err) => {
          Swal.fire("Error", err.error?.metadata?.message || "Gagal memperbarui data", "error");
        }
      });
  }

  // ===================== FILTER =====================

  onStatusFilterChange(): void {
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
    this.filters.status = null;
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
}
