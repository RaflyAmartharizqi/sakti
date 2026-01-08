import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferensiPertanyaanSmkiService } from './referensi-pertanyaan-smki.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-referensi-pertanyaan-smki',
  templateUrl: './referensi-pertanyaan-smki.component.html',
  styleUrl: './referensi-pertanyaan-smki.component.scss'
})
export class ReferensiPertanyaanSmkiComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  constructor(
    private modalService: NgbModal,
    private refPertanyaanSmkiService: ReferensiPertanyaanSmkiService
  ) {}

  entriesPerPage: number = 10;
  searchQuery: string = '';
  currentPage: number = 1;
  isActive: boolean = false;

  refPertanyaanSmki: any[] = [];
  refPertanyaanSmkiData = {
    id: null,
    refKlausulAnnexId: null,
    jenisAuditId: 1,
    pertanyaan: '',
    hasilYangDiharapkan: '',
    kodeBidang: [] as string[],
    status: true
  };

  filters = {
    page: 1,
    limit: 10,
    search: '',
    status: null,
  }

  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  isLoading = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengaturan' },
      { label: 'Referensi Pertanyaan SMKI', active: true }
    ];
    this.getBidangSmki();
    this.getStandarAssesment();
    this.loadData();
  }

  checkBoxBidang(kode:string,event:any){
    if (event.target.checked) {
      if (!this.refPertanyaanSmkiData.kodeBidang.includes(kode)) {
        this.refPertanyaanSmkiData.kodeBidang.push(kode);
      }
    } else {
      const index = this.refPertanyaanSmkiData.kodeBidang.indexOf(kode);
      if (index > -1) {
        this.refPertanyaanSmkiData.kodeBidang.splice(index, 1);
      }
    }
    console.log("Updated asesorId (Eksternal):", this.refPertanyaanSmkiData.kodeBidang);
  }

  openModalReferensiPertanyaanSmki(referensiPertanyaanSmkiModal: TemplateRef<any>) {
    this.resetData();
    this.modalService.open(referensiPertanyaanSmkiModal, { centered: true });
  } 

  smkiBidang: any[] = [];
  standarAssesment: any[] = [];
  refKlausulAnnex: any[] = [];
  selectedKlausulAnnex = null;
  selectedStandar: number | null = null;

  getBidangSmki() {
    this.refPertanyaanSmkiService.getBidangSmki().subscribe({
      next: (res: any) => {
        this.smkiBidang = res.response.list;
      },
      error: (err) => console.error(err)
    });
  }

  getStandarAssesment() {
    this.refPertanyaanSmkiService.getStandarAssesment().subscribe({
      next: (res: any) => {
        this.standarAssesment = res.response.list;
        this.selectedStandar = 1;
        this.getRefKlausulAnnexByStandar(this.selectedStandar);
        this.onStandarChange();
      },
      error: (err) => console.error(err)
    });
  }

  getRefKlausulAnnexByStandar(selectedStandar: number) {
    this.refPertanyaanSmkiService.getRefKlausulAnnexByStandar(selectedStandar).subscribe({
      next: (res: any) => {
        this.refKlausulAnnex = res.response.list;
        console.log(this.refKlausulAnnex);
      },
      error: (err) => console.error(err)
    });
  }

  loadData() {
    this.isLoading = true;
    this.refPertanyaanSmki = [];
    this.refPertanyaanSmkiService.get(this.filters).subscribe({
      next: (res) => {
        this.refPertanyaanSmki = res.response.list;
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
    if (!this.refPertanyaanSmkiData.refKlausulAnnexId ||
        !this.refPertanyaanSmkiData.pertanyaan ||
        !this.refPertanyaanSmkiData.hasilYangDiharapkan ||
        this.refPertanyaanSmkiData.kodeBidang.length == 0) {
        return;
    }
    const payload = {
      ...this.refPertanyaanSmkiData,
      status: this.refPertanyaanSmkiData.status ? 1 : 0
    };
    this.refPertanyaanSmkiService.create(payload).subscribe({
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

  onStandarChange() {
    console.log(this.selectedStandar);
    if (!this.selectedStandar) return;
    this.getRefKlausulAnnexByStandar(this.selectedStandar);
  }

  onEditClickReferensiPertanyaanSmki(onEditClickReferensiPertanyaanSmki: TemplateRef<any>, id: number): void {
    this.resetData();
    this.refPertanyaanSmkiService.getById(id).subscribe({
      next: (res: any) => {
        const data = res.response;

        this.refPertanyaanSmkiData = {
          id: data.id,
          refKlausulAnnexId: data.refKlausulAnnexId,
          jenisAuditId: data.jenisAuditId,
          pertanyaan: data.pertanyaan,
          hasilYangDiharapkan: data.hasilYangDiharapkan,
          status: data.status == 1,
          kodeBidang: data.bidang?.map((x:any) => x.kode) ?? []
        };
        console.log("Data for Edit:", this.refPertanyaanSmkiData);
        this.modalService.open(onEditClickReferensiPertanyaanSmki, { centered: true });
      },
      error: (err) => {
        console.error(err);
        Swal.fire("Error", "Gagal memuat data pertanyaan SMKI.", "error");
      }
    });
  }

  resetData() {
    this.refPertanyaanSmkiData = {
      id: null,
      refKlausulAnnexId: null,
      jenisAuditId: 1,
      pertanyaan: '',
      hasilYangDiharapkan: '',
      status: true,
      kodeBidang: []
    };
  }

  update() {
    if (!this.refPertanyaanSmkiData.refKlausulAnnexId ||
        !this.refPertanyaanSmkiData.pertanyaan ||
        !this.refPertanyaanSmkiData.hasilYangDiharapkan ||
        this.refPertanyaanSmkiData.kodeBidang.length == 0) {
        return;
    }
    if (!this.refPertanyaanSmkiData.id) {
      Swal.fire("Error", "ID Referensi Pertanyaan tidak ditemukan.", "error");
      return;
    }

    const payload = {
      ...this.refPertanyaanSmkiData,
      status: this.refPertanyaanSmkiData.status ? 1 : 0
    };

    console.log("UPDATE PAYLOAD:", payload);

    this.refPertanyaanSmkiService.update(this.refPertanyaanSmkiData.id, payload)
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