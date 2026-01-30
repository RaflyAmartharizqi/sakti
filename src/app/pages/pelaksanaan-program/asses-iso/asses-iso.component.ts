import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import Swal from 'sweetalert2';
import { AssesIsoService } from './asses-iso.service';
import { GlobalComponent } from 'src/app/global-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-asses-iso',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CommonModule,
    SharedModule,
    FormsModule,
    FlatpickrModule,
    RouterModule,  
  ],
  templateUrl: './asses-iso.component.html',
  styleUrl: './asses-iso.component.scss'
})
export class AssesIsoComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private assesIsoService: AssesIsoService
  ) {}

  isLoading = false;

  transaksiAuditId = 0;
  jadwalUnitKerjaAuditId = 0;
  unitKerja = {
    kode: '',
    nama: ''
  }
  bidang: any[] = [];
  progress: any;

  refKlausulAnnex: any[] = [];
  refKlausulAnnexList: any[] = [];

  selectedStandar = 1;
  currentKlausulIndex = 0;
  currentBidangIndex = 0;
  selectedBidang: any;
  selectedKlausul: any;
  selectedRatingId: number | null = null;

  pertanyaan: any[] = [];
  rating: any[] = [];
  selectedRating: any;

  tanggapanMap: {
    [refId: number]: {
      refPertanyaanAuditId: number;
      tanggapan: string | null;
      ratingId?: number | null;
      attachment?: {
        id: number;
        originalFileName: string;
        storedFileName: string;
        contentType: string;
      } | null;
      file?: File | null;
      previewUrl?: string | null;
    };
  } = {};

  /* ================= INIT ================= */
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
      console.log('🔥 ngOnInit DIPANGGIL');
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Pengisian Assesment ISO' },
      { label: 'Asses ISO', active: true }
    ];
    this.route.paramMap.subscribe(params => {
      this.transaksiAuditId = Number(params.get('transaksiAuditId'));
      this.loadData();
    });
  }

  /* ================= LOAD ================= */
  loadData(): void {
    this.isLoading = true;
    this.assesIsoService.getListPertanyaanIso(this.transaksiAuditId)
      .subscribe(res => {
        this.unitKerja.kode = res.response.unitKerja.kode;
        this.unitKerja.nama = res.response.unitKerja.nama;
        this.jadwalUnitKerjaAuditId = res.response.unitKerja.jadwalUnitKerjaAuditId;
        this.progress = res.response.progress;
        this.refKlausulAnnex = res.response.refKlausulAnnex;
        this.getRating();
        this.getBidang(this.unitKerja.kode);
        this.buildTanggapanMap();
        if (this.refKlausulAnnex.length > 0) {
          this.setKlausul(0); // otomatis set bidang & pertanyaan
        }
        this.isLoading = false;
      });
  }

  getRating(): void {
    this.assesIsoService.getRating().subscribe({
      next: (res) => {
        this.rating = res.response.list;
      },
    });
  }

  getBidang(unitKerjaKode: string): void {
    this.assesIsoService.getBidang(unitKerjaKode).subscribe({
      next: (res) => {
        this.bidang = res.response.list;
      },
    });
  }

  private buildTanggapanMap(): void {
    if (!Array.isArray(this.refKlausulAnnex)) return;

    this.refKlausulAnnex.forEach((k: any) => {
      if (!Array.isArray(k.bidang)) return;

      k.bidang.forEach((b: any) => {
        if (!Array.isArray(b.pertanyaan)) return;

        b.pertanyaan.forEach((p: any) => {
          if (!p?.refPertanyaanAuditId) return;

          if (this.tanggapanMap[p.refPertanyaanAuditId]) return;

          this.tanggapanMap[p.refPertanyaanAuditId] = {
            refPertanyaanAuditId: p.refPertanyaanAuditId,
            ratingId: p.jawaban?.ratingId ?? null,
            tanggapan: p.jawaban?.tanggapan ?? null,
            attachment: p.jawaban?.attachment ?? null,
            previewUrl: p.jawaban?.attachment
              ? GlobalComponent.API_URL +
                `Attachment/preview/${p.jawaban.attachment.storedFileName}`
              : null
          };
        });
      });
    });
    console.log('TANGGAPAN MAP:', this.tanggapanMap);
  }


  private loadPreviewIfNeeded(p: any): void {
    const att = p.jawaban?.attachment;
    if (!att) return;
    if (!att.contentType?.startsWith('image/')) return;

    this.assesIsoService
      .getAttachmentPreviewUrl(att.storedFileName)
      .subscribe(res => {
        this.tanggapanMap[p.refPertanyaanAuditId].previewUrl =
          res.response.previewUrl;
      });
  }

  setKlausul(index: number): void {
    this.currentKlausulIndex = index;
    this.selectedKlausul = this.refKlausulAnnex[index];

    this.currentBidangIndex = 0;
    this.setBidang(0);
  }

  setBidang(index: number): void {
    if (!this.selectedKlausul?.bidang?.length) {
      this.pertanyaan = [];
      return;
    }

    this.currentBidangIndex = index;
    this.selectedBidang = this.selectedKlausul.bidang[index];

    this.pertanyaan = this.selectedBidang.pertanyaan.map((p: any) => ({
      ...p,
      tanggapanText: this.tanggapanMap[p.refPertanyaanAuditId]?.tanggapan ?? ''
    }));
    console.log('REF:', this.refKlausulAnnex);
    console.log('BIDANG KLAUSUL 0:', this.refKlausulAnnex[0]?.bidang);
  }

  next(): void {
    const totalBidang = this.selectedKlausul.bidang.length;

    if (this.currentBidangIndex < totalBidang - 1) {
      this.setBidang(this.currentBidangIndex + 1);
      return;
    }

    if (this.currentKlausulIndex < this.refKlausulAnnex.length - 1) {
      this.setKlausul(this.currentKlausulIndex + 1);
    }
  }

  previous(): void {
    if (this.currentBidangIndex > 0) {
      this.setBidang(this.currentBidangIndex - 1);
      return;
    }
    if (this.currentKlausulIndex > 0) {
      this.setKlausul(this.currentKlausulIndex - 1);
      const lastBidangIndex =
        this.selectedKlausul.bidang.length - 1;
      this.setBidang(lastBidangIndex);
    }
  }


  onFileSelected(event: Event, refId: number) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: "Error",
        text: "Format File tidak diizinkan",
        icon: "error"
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: "Error",
        text: "Ukuran maksimal 2 MB",
        icon: "error"
      });
      return;
    }

    if (!this.tanggapanMap[refId]) {
      this.tanggapanMap[refId] = {
        refPertanyaanAuditId: refId,
        tanggapan: null
      };
    }

    this.tanggapanMap[refId].file = file;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.tanggapanMap[refId].previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.tanggapanMap[refId].previewUrl = null;
    }
  }

  openModalKonfirmasi(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  saveDraft(): void {
    console.log('TANGGAPAN MAP:', this.tanggapanMap);
    const form = new FormData();
    form.append('TransaksiAuditId', this.transaksiAuditId.toString());

    Object.values(this.tanggapanMap).forEach((item, i) => {
      form.append(`Tanggapan[${i}].RefPertanyaanAuditId`, item.refPertanyaanAuditId.toString());
      form.append(`Tanggapan[${i}].Tanggapan`, item.tanggapan ?? '');
      form.append(`Tanggapan[${i}].RatingId`, item.ratingId ? item.ratingId.toString() : '');
      if (item.file) {
        form.append(`Tanggapan[${i}].Attachment`, item.file);
      }
    });
    this.assesIsoService.saveDraftJawaban(form).subscribe(() => {
      Swal.fire('Berhasil', 'Draft disimpan', 'success');
    });
    this.loadData();
  }

  submitJawaban(): void {
    this.isLoading = true;
    const form = new FormData();
    form.append('TransaksiAuditId', this.transaksiAuditId.toString());

    Object.values(this.tanggapanMap).forEach((item, i) => {
      form.append(`Tanggapan[${i}].RefPertanyaanAuditId`, item.refPertanyaanAuditId.toString());
      form.append(`Tanggapan[${i}].Tanggapan`, item.tanggapan ?? '');
      form.append(`Tanggapan[${i}].RatingId`, item.ratingId ? item.ratingId.toString() : '');
      if (item.file) {
        form.append(`Tanggapan[${i}].Attachment`, item.file);
      }
    });
    this.modalService.dismissAll();
    
    this.assesIsoService.submitJawaban(form).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Tanggapan berhasil disubmit',
          timer: 1500,
          showConfirmButton: false
        });
        this.isLoading = false;
        setTimeout(() => {
        this.router.navigate(
          ['../../detail-iso', this.jadwalUnitKerjaAuditId],
          { relativeTo: this.route }
        );
        }, 1500);
      },
      error: (err) => {
        Swal.fire(
          'Gagal',
          err?.error?.metadata.message || 'Terjadi kesalahan saat submit tanggapan',
          'error'
        );
        this.isLoading = false;
      }
    });
  }

  getRefKlausulAnnexByStandar(standar: number): void {
    this.assesIsoService
      .getRefKlausulAnnexByStandar(standar)
      .subscribe(res => {
        this.refKlausulAnnexList = res.response.list;
      });
  }

  trackByRefId(_: number, item: any): number {
    return item.refPertanyaanAuditId;
  }
}