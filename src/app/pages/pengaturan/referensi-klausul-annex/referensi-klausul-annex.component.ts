import { Component, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferensiKlausulAnnexService } from './referensi-klausul-annex.service';
import { SharedModule } from "../../../shared/shared.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, switchMap, distinctUntilChanged, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-referensi-klausul-annex',
  templateUrl: './referensi-klausul-annex.component.html',
  styleUrls: ['./referensi-klausul-annex.component.scss']
})

export class ReferensiKlausulAnnexComponent implements OnInit{
  breadCrumbItems!: Array<{}>;
  constructor(
    private modalService: NgbModal,
    private refKlausulAnnexService: ReferensiKlausulAnnexService
  ) {}

  entriesPerPage: number = 10;
  searchQuery: string = '';
  isActive: boolean = false;

  refKlausulAnnexData = {
    id: null,
    standar: '',
    kode: '',
    nama: '',
    deskripsi: '',
    status: true
  };

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengaturan' },
      { label: 'Referensi Klausul/Annex', active: true }
    ];
    
    this.loadData();
  }

  onEditClickReferensiKlausulAnnex(updateReferensiKlausulAnnexModal: TemplateRef<any>, id: number): void {
    this.resetData();
    this.refKlausulAnnexService.getById(id).subscribe({
      next: (res) => {
        const data = res.response;
        this.refKlausulAnnexData = {
          id: data.Id,
          standar: data.Standar,
          kode: data.Kode,
          nama: data.Nama,
          deskripsi: data.Deskripsi,
          status: data.Status === 1 ? true : false
        };
        console.log(this.refKlausulAnnexData);
        this.modalService.open(updateReferensiKlausulAnnexModal, { centered: true });
      },
      error: () => {
        Swal.fire("Error", "Gagal memuat data user.", "error");
      }
    });
  }

  openModalReferensiKlausulAnnex(tambahReferensiKlausulAnnexModal: TemplateRef<any>) {
    this.resetData();
    this.modalService.open(tambahReferensiKlausulAnnexModal, { centered: true });
  }

  refKlausulAnnex: any[] = [];
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
    status: null,
  }

  loadData() {
    this.isLoading = true;
    this.refKlausulAnnex = [];
    this.refKlausulAnnexService.get(this.filters).subscribe({
      next: (res) => {
        this.refKlausulAnnex = res.response.list;
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
    const payload = {
      ...this.refKlausulAnnexData,
      status: this.refKlausulAnnexData.status ? 1 : 0
    };
    this.refKlausulAnnexService.create(payload).subscribe({
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
    if (!this.refKlausulAnnexData.id) {
        Swal.fire("Error", "ID user tidak ditemukan.", "error");
        return;
    }
    const payload = {
      ...this.refKlausulAnnexData,
      status: this.refKlausulAnnexData.status ? 1 : 0
    };
    console.log(payload);
    this.refKlausulAnnexService.update(this.refKlausulAnnexData.id, payload)
      .subscribe({
        next: (res) => {
          Swal.fire("Sukses", "Data user berhasil diperbarui!", "success");
          this.modalService.dismissAll();
          this.loadData();
        },
        error: (err) => {
          Swal.fire("Error", err.error?.metadata?.message || "Gagal update Referensi Klausul Annex", "error");
        }
    });
  }

  resetData() {
    this.refKlausulAnnexData = {
      id: null,
      standar: '',
      kode: '',
      nama: '',
      deskripsi: '',
      status: true
    };

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

}
