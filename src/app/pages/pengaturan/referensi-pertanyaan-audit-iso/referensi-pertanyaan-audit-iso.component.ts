import { Component, OnInit, AfterViewInit, TemplateRef, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe } from '@angular/common';

interface ReferensiPertanyaanAuditIso {
  no: number,
  standar: string,
  area: string,
  kodeArea: string,
  kodePertanyaan: string,
  pertanyaan: string,
  hasilYangDiharapkan: string,
  bidang: string,
  status: string
}

interface PilihanBidang {
  namaGroups: string,
  groups: {
    nama: string,
    value: string
  }[];
}

interface BidangOption {
  id: string;
  nama: string;
}

@Component({
  selector: 'app-referensi-pertanyaan-audit-iso',
  templateUrl: './referensi-pertanyaan-audit-iso.component.html',
  styleUrl: './referensi-pertanyaan-audit-iso.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ReferensiPertanyaanAuditIsoComponent {
  breadCrumbItems!: Array<{}>;
  constructor(private modalService: NgbModal) {}

  entriesPerPage: number = 10;
  searchQuery: string = '';
  currentPage: number = 1;

  referensiPertanyaanAuditIso: ReferensiPertanyaanAuditIso[] = [
    {
      no: 1,
      standar: 'Audit ISO 90001',
      area: 'Area A',
      kodeArea: '4.1',
      kodePertanyaan: '4.1-01',
      pertanyaan: 'Apakah proses dokumentasi sudah sesuai SOP?',
      hasilYangDiharapkan: 'Dokumen terstandar dan tersimpan di repository',
      bidang: 'Unit Sertifikasi, Unit Manajemen Mutu, Unit Administrasi',
      status: 'Aktif'
    }
  ]

  pilihanBidang: PilihanBidang[] = [
    {
      namaGroups: 'Lembaga Sertifikasi Profesi Pihak Kedua BPJS Kesehatan',
      groups: [
        {
          nama: 'Unit Sertfikasi',
          value: '1',
        },
        {
          nama: 'Unit Manajemen Mutu',
          value: '1',
        },
        {
          nama: 'Unit Administrasi',
          value: '1',
        },
      ]
    },
    {
      namaGroups: 'Kedeputian Bidang Tata Kelola, Risiko, dan Kepatuhan Normal',
      groups: [
        {
          nama: 'Asisten Deputi Tata Kelola',
          value: '1',
        },
        {
          nama: 'Asisten Deputi Hubungan Antar Keluarga',
          value: '1',
        },
        {
          nama: 'Asisten Deputi Pengelolaan dan Pengembangan Data',
          value: '1',
        },
      ]
    }
  ]

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengaturan' },
      { label: 'Referensi Pertanyaan Audit ISO', active: true }
    ];
  }

  get filteredReferensiPertanyaanAuditIso(): ReferensiPertanyaanAuditIso[] {
    return this.referensiPertanyaanAuditIso.filter(referensi => {
      const matchesSearch = !this.searchQuery ||
        referensi.standar.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.area.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.kodeArea.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.kodePertanyaan.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.pertanyaan.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.hasilYangDiharapkan.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.bidang.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.status.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesSearch;
    });
  }

  get paginatedReferensiPertanyaanAuditIso(): ReferensiPertanyaanAuditIso[] {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    return this.filteredReferensiPertanyaanAuditIso.slice(startIndex, endIndex);
  }

  onEditClickReferensiPertanyaanAuditIso(referensi: ReferensiPertanyaanAuditIso, referensiPertanyaanAuditIsoModal: TemplateRef<any>): void {
    const modalRef = this.modalService.open(referensiPertanyaanAuditIsoModal, { centered: true });
    modalRef.result.finally(() => {
      this.selectedBidang = [];
    });
  }

  openModalReferensiPertanyaanAuditIso(referensiPertanyaanAuditIsoModal: TemplateRef<any>) {
    const modalRef = this.modalService.open(referensiPertanyaanAuditIsoModal, { centered: true });
    modalRef.result.finally(() => {
      this.selectedBidang = [];
    });
  }

  bidangOptions: BidangOption[] = [
    { id: '1', nama: 'Manajemen Mutu' },
    { id: '2', nama: 'Administrasi' },
    { id: '3', nama: 'Teknis Lapangan' },
    { id: '4', nama: 'Auditor Keuangan' }
  ];

  selectedBidang: string[] = [];
}
