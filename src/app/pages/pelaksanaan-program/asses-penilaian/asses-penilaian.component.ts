
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import Swal from 'sweetalert2';
import { AssesPenilaianService } from './asses-penilaian.service';
import { GlobalComponent } from 'src/app/global-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssesIsoService } from '../asses-iso/asses-iso.service';

@Component({
  selector: 'app-asses-penilaian',
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
  templateUrl: './asses-penilaian.component.html',
  styleUrl: './asses-penilaian.component.scss'
})
export class AssesPenilaianComponent {
constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private assesPenilaianService: AssesPenilaianService
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
      jawaban: string | null;
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
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Penilaian atau Verifikasi' },
      { label: 'Asses Penilaian', active: true }
    ];
    this.route.paramMap.subscribe(params => {
      this.transaksiAuditId = Number(params.get('transaksiAuditId'));
      this.loadData();
    });
  }

  /* ================= LOAD ================= */
  loadData(): void {
    this.isLoading = true;
    this.assesPenilaianService.getListPertanyaanPenilaian(this.transaksiAuditId)
      .subscribe(res => {
        this.unitKerja.kode = res.response.unitKerja.kode;
        this.unitKerja.nama = res.response.unitKerja.nama;
        this.jadwalUnitKerjaAuditId = res.response.unitKerja.jadwalUnitKerjaAuditId;
        this.progress = res.response.progress;
        this.refKlausulAnnex = res.response.refKlausulAnnex;
        this.getRating();
        this.buildTanggapanMap();
        if (this.refKlausulAnnex.length > 0) {
          this.setKlausul(0);
        }
        this.isLoading = false;
      });
  }

  getRating(): void {
    this.assesPenilaianService.getRating().subscribe({
      next: (res) => {
        this.rating = res.response.list;
      },
    });
  }

  private buildTanggapanMap(): void {
    if (!Array.isArray(this.refKlausulAnnex)) return;

    this.refKlausulAnnex.forEach((k: any) => {
      k.pertanyaan.forEach((p: any) => {
        if (!p?.refPertanyaanAuditId) return;

        if (this.tanggapanMap[p.refPertanyaanAuditId]) return;

        this.tanggapanMap[p.refPertanyaanAuditId] = {
          refPertanyaanAuditId: p.refPertanyaanAuditId,
          ratingId: p.jawaban?.ratingId ?? null,
          jawaban: p.jawaban?.jawaban ?? null,
          tanggapan: p.jawaban?.tanggapan ?? null,
          attachment: p.jawaban?.attachment ?? null,
          previewUrl: p.jawaban?.attachment
            ? GlobalComponent.API_URL +
              `Attachment/preview/${p.jawaban.attachment.storedFileName}`
            : null
      };
      });
    });
    console.log('TANGGAPAN MAP:', this.tanggapanMap);
  }


  private loadPreviewIfNeeded(p: any): void {
    const att = p.jawaban?.attachment;
    if (!att) return;
    if (!att.contentType?.startsWith('image/')) return;

    this.assesPenilaianService
      .getAttachmentPreviewUrl(att.storedFileName)
      .subscribe(res => {
        this.tanggapanMap[p.refPertanyaanAuditId].previewUrl =
          res.response.previewUrl;
      });
  }

  setKlausul(index: number): void {
    this.currentKlausulIndex = index;
    this.selectedKlausul = this.refKlausulAnnex[index];

    this.pertanyaan = this.selectedKlausul.pertanyaan.map((p: any) => ({
      ...p,
      jawabanText: this.tanggapanMap[p.refPertanyaanAuditId]?.jawaban ?? '',
      tanggapanText: this.tanggapanMap[p.refPertanyaanAuditId]?.tanggapan ?? ''
    }));
  }

  next(): void {
    if (this.currentKlausulIndex < this.refKlausulAnnex.length - 1) {
      this.setKlausul(this.currentKlausulIndex + 1);
    }
  }

  previous(): void {
    if (this.currentKlausulIndex > 0) {
      this.setKlausul(this.currentKlausulIndex - 1);
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
        jawaban: null,
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
    this.assesPenilaianService.saveDraftTanggapan(form).subscribe(() => {
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
    
    this.assesPenilaianService.submitTanggapan(form).subscribe({
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
          ['../../detail-penilaian', this.jadwalUnitKerjaAuditId],
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
    this.assesPenilaianService
      .getRefKlausulAnnexByStandar(standar)
      .subscribe(res => {
        this.refKlausulAnnexList = res.response.list;
      });
  }

  trackByRefId(_: number, item: any): number {
    return item.refPertanyaanAuditId;
  }
}
