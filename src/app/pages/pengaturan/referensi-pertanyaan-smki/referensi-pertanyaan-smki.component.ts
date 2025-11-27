import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface ReferensiPertanyaanSmki {
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

@Component({
  selector: 'app-referensi-pertanyaan-smki',
  templateUrl: './referensi-pertanyaan-smki.component.html',
  styleUrl: './referensi-pertanyaan-smki.component.scss'
})
export class ReferensiPertanyaanSmkiComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  constructor(private modalService: NgbModal) {}

  entriesPerPage: number = 10;
  searchQuery: string = '';
  currentPage: number = 1;
  isActive: boolean = false;

  referensiPertanyaanSmki: ReferensiPertanyaanSmki[] = [
    {
      no: 1,
      standar: 'Assesment SMKI',
      area: 'Area A',
      kodeArea: '4.1',
      kodePertanyaan: '4.1-01',
      pertanyaan: 'Apakah proses dokumentasi sudah sesuai SOP?',
      hasilYangDiharapkan: 'Dokumen terstandar dan tersimpan di repository',
      bidang: 'SDMUKP-KC, PKP-KC, PMU-KC, YANFASKES-KC, JPK-Kepwil',
      status: 'Aktif'
    }
  ]

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengaturan' },
      { label: 'Referensi Pertanyaan SMKI', active: true }
    ];
  }

  get filteredReferensiPertanyaanSmki(): ReferensiPertanyaanSmki[] {
    return this.referensiPertanyaanSmki.filter(referensi => {
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

  get paginatedReferensiPertanyaanSmki(): ReferensiPertanyaanSmki[] {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    return this.filteredReferensiPertanyaanSmki.slice(startIndex, endIndex);
  }

  onEditClickReferensiPertanyaanSmki(referensi: ReferensiPertanyaanSmki, referensiPertanyaanSmkiModal: TemplateRef<any>): void {
    this.modalService.open(referensiPertanyaanSmkiModal, { centered: true });
  }

  openModalReferensiPertanyaanSmki(referensiPertanyaanSmkiModal: TemplateRef<any>) {
    this.modalService.open(referensiPertanyaanSmkiModal, { centered: true });
  } 
}