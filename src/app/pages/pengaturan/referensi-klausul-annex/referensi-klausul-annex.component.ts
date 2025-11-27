import { Component, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface ReferensiKlausulAnnex {
  no: number,
  standar: string,
  kode: string,
  nama: string,
  deskripsi: string,
  status: string
}

@Component({
  selector: 'app-referensi-klausul-annex',
  templateUrl: './referensi-klausul-annex.component.html',
  styleUrls: ['./referensi-klausul-annex.component.scss']
})

export class ReferensiKlausulAnnexComponent implements OnInit{
  breadCrumbItems!: Array<{}>;
  constructor(private modalService: NgbModal) {}

  entriesPerPage: number = 10;
  searchQuery: string = '';
  currentPage: number = 1;
  isActive: boolean = false;

  referensiKlausulAnnex: ReferensiKlausulAnnex[] = [
    {
      no: 1,
      standar: 'Assesment SMKI',
      kode: 'A7',
      nama: 'Kontrol Fisik (Physical Controls)',
      deskripsi: 'Memahami organisasi dan konteksnya',
      status: 'Aktif'
    },
    {
      no: 2,
      standar: 'Assesment SMKI',
      kode: 'A8',
      nama: 'Kontrol Technology (Technology Controls)',
      deskripsi: 'Sumber Daya',
      status: 'Non-Aktif'
    },
  ];

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengaturan' },
      { label: 'Referensi Klausul/Annex', active: true }
    ];
  }

  get filteredReferensiKlausulAnnex(): ReferensiKlausulAnnex[] {
    return this.referensiKlausulAnnex.filter(referensi => {
      const matchesSearch = !this.searchQuery ||
        referensi.standar.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.kode.includes(this.searchQuery) ||
        referensi.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.deskripsi.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        referensi.status.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesSearch;
    });
  }

  get paginatedReferensiKlausulAnnex(): ReferensiKlausulAnnex[] {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    return this.filteredReferensiKlausulAnnex.slice(startIndex, endIndex);
  }

  onEditClickReferensiKlausulAnnex(referensi: ReferensiKlausulAnnex, referensiKlausulAnnexModal: TemplateRef<any>): void {
    this.modalService.open(referensiKlausulAnnexModal, { centered: true });
  }

  openModalReferensiKlausulAnnex(referensiKlausulAnnexModal: TemplateRef<any>) {
    this.modalService.open(referensiKlausulAnnexModal, { centered: true });
  }
}
