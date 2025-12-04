import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferensiPertanyaanSmkiService } from './referensi-pertanyaan-smki.service';

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
  constructor(
    private modalService: NgbModal,
    private refPertanyaanSmkiServcie: ReferensiPertanyaanSmkiService
  ) {}

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
    this.getSmkiBidang();
    this.getStandarKlausulAnnex();
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

  smkiBidangKC: any[] = [];
  smkiBidangKepwil: any[] = [];
  standarKlausulAnnex: any[] = [];
  refKlausulAnnex: any[] = [];
  selectedStandar = '';
  selectedKlausulAnnex = null;


  getSmkiBidang() {
    this.refPertanyaanSmkiServcie.getSmkiBidang().subscribe({
      next: (res: any) => {

        const data = res.response.list;

        this.smkiBidangKC = data.filter((x: any) => x.Jenis === 'KC');
        this.smkiBidangKepwil = data.filter((x: any) => x.Jenis === 'Kepwil');

        console.log('KC:', this.smkiBidangKC);
        console.log('Kepwil:', this.smkiBidangKepwil);
      },
      error: (err) => console.error(err)
    });
  }

  getStandarKlausulAnnex() {
    this.refPertanyaanSmkiServcie.getStandarKalusulAnnex().subscribe({
      next: (res: any) => {
        this.standarKlausulAnnex = res.response;
        console.log(this.standarKlausulAnnex);
      },
      error: (err) => console.error(err)
    });
  }

  getRefKlausulAnnexByStandar(selectedStandar: string) {
    this.refPertanyaanSmkiServcie.getRefKlausulAnnexByStandar(selectedStandar).subscribe({
      next: (res: any) => {
        this.refKlausulAnnex = res.response;
        console.log(this.refKlausulAnnex);
      },
      error: (err) => console.error(err)
    });
  }

  onStandarChange() {
    console.log("OKEH");
    this.getRefKlausulAnnexByStandar(this.selectedStandar);
  }

}