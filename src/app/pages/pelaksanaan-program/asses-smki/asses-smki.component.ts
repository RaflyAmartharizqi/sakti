import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import Swal from 'sweetalert2';
import { AssesSmkiService } from './asses-smki.service';
import { GlobalComponent } from 'src/app/global-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    FlatpickrModule,
    RouterModule,

  ],
  templateUrl: './asses-smki.component.html',
  styleUrl: './asses-smki.component.scss'
})
export class AssesSmkiComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private assesSmkiService: AssesSmkiService
  ) {}

  isLoading = false;

  transaksiAuditId = 0;
  jadwalUnitKerjaAuditId = 0;
  unitKerja: any;
  bidang: any;
  progress: any;

  refKlausulAnnex: any[] = [];
  refKlausulAnnexList: any[] = [];

  selectedStandar = 1;
  currentKlausulIndex = 0;
  selectedKlausul: any;

  pertanyaan: any[] = [];

  jawabanMap: {
    [refId: number]: {
      refPertanyaanAuditId: number;
      jawaban: string | null;
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
      { label: 'Pengisian Assesment SMKI' },
      { label: 'Asses SMKI', active: true }
    ];
    this.route.paramMap.subscribe(params => {
      this.transaksiAuditId = Number(params.get('transaksiAuditId'));
      this.loadData();
    });

    this.getRefKlausulAnnexByStandar(this.selectedStandar);
  }

  /* ================= LOAD ================= */
  loadData(): void {
    this.isLoading = true;

    this.assesSmkiService
      .getListPertanyaanSmki(this.transaksiAuditId)
      .subscribe(res => {
        this.unitKerja = res.response.unitKerja;
        this.jadwalUnitKerjaAuditId = res.response.unitKerja.jadwalUnitKerjaAuditId;
        this.bidang = res.response.bidang;
        this.progress = res.response.progress;
        this.refKlausulAnnex = res.response.refKlausulAnnex;
        this.buildJawabanMap();
        this.setKlausul(this.currentKlausulIndex);

        this.isLoading = false;
      });
  }

  /* ================= MAP ================= */
  private buildJawabanMap(): void {
    this.refKlausulAnnex.forEach((k: any) => {
      k.pertanyaan.forEach((p: any) => {

        if (this.jawabanMap[p.refPertanyaanAuditId]) return;

        this.jawabanMap[p.refPertanyaanAuditId] = {
          refPertanyaanAuditId: p.refPertanyaanAuditId,
          jawaban: p.jawaban?.jawaban ?? null,
          attachment: p.jawaban?.attachment ?? null,
          previewUrl: p.jawaban?.attachment
            ? GlobalComponent.API_URL + `Attachment/preview/${p.jawaban.attachment.storedFileName}`
            : null
        };

        this.loadPreviewIfNeeded(p);
      });
    });
  }

  private loadPreviewIfNeeded(p: any): void {
    const att = p.jawaban?.attachment;
    if (!att) return;
    if (!att.contentType?.startsWith('image/')) return;

    this.assesSmkiService
      .getAttachmentPreviewUrl(att.storedFileName)
      .subscribe(res => {
        this.jawabanMap[p.refPertanyaanAuditId].previewUrl =
          res.response.previewUrl;
      });
  }

  /* ================= UI ================= */
  setKlausul(index: number): void {
    this.currentKlausulIndex = index;
    this.selectedKlausul = this.refKlausulAnnex[index];

    this.pertanyaan = this.selectedKlausul.pertanyaan.map((p: any) => ({
      ...p,
      jawabanText: this.jawabanMap[p.refPertanyaanAuditId]?.jawaban ?? ''
    }));
  }

  nextKlausul(): void {
    if (this.currentKlausulIndex < this.refKlausulAnnex.length - 1) {
      this.setKlausul(this.currentKlausulIndex + 1);
    }
  }

  previousKlausul(): void {
    if (this.currentKlausulIndex > 0) {
      this.setKlausul(this.currentKlausulIndex - 1);
    }
  }

  /* ================= FILE ================= */
  openFileInput(refId: number): void {
    const el = document.getElementById('file-' + refId) as HTMLInputElement;
    el?.click();
  }

  onFileSelected(event: Event, refId: number) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    /* ===== VALIDASI ===== */
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

    /* ===== INIT MAP ===== */
    if (!this.jawabanMap[refId]) {
      this.jawabanMap[refId] = {
        refPertanyaanAuditId: refId,
        jawaban: null
      };
    }

    this.jawabanMap[refId].file = file;

    /* ===== PREVIEW ===== */
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.jawabanMap[refId].previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.jawabanMap[refId].previewUrl = null;
    }
  }

  openModalKonfirmasi(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  /* ================= SAVE ================= */
  saveDraft(): void {
    const form = new FormData();
    form.append('TransaksiAuditId', this.transaksiAuditId.toString());

    Object.values(this.jawabanMap).forEach((item, i) => {
      form.append(`Jawaban[${i}].RefPertanyaanAuditId`, item.refPertanyaanAuditId.toString());
      form.append(`Jawaban[${i}].Jawaban`, item.jawaban ?? '');
      if (item.file) {
        form.append(`Jawaban[${i}].Attachment`, item.file);
      }
    });
    this.assesSmkiService.saveDraftJawaban(form).subscribe(() => {
      this.loadData();
      Swal.fire('Berhasil', 'Draft disimpan', 'success');
    });
  }

  submitJawaban(): void {
    this.isLoading = true;
    const form = new FormData();
    form.append('TransaksiAuditId', this.transaksiAuditId.toString());

    Object.values(this.jawabanMap).forEach((item, i) => {
      form.append(`Jawaban[${i}].RefPertanyaanAuditId`, item.refPertanyaanAuditId.toString());
      form.append(`Jawaban[${i}].Jawaban`, item.jawaban ?? '');

      if (item.file) {
        form.append(`Jawaban[${i}].Attachment`, item.file);
      }
    });
    this.modalService.dismissAll();
    
    this.assesSmkiService.submitJawaban(form).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Jawaban berhasil disubmit',
          timer: 1500,
          showConfirmButton: false
        });
        this.isLoading = false;
        setTimeout(() => {
        this.router.navigate(
          ['../../detail-smki', this.jadwalUnitKerjaAuditId],
          { relativeTo: this.route }
        );
        }, 1500);
      },
      error: (err) => {
        Swal.fire(
          'Gagal',
          err?.error?.metadata.message || 'Terjadi kesalahan saat submit jawaban',
          'error'
        );
        this.isLoading = false;
      }
    });
  }


  /* ================= REF ================= */
  getRefKlausulAnnexByStandar(standar: number): void {
    this.assesSmkiService
      .getRefKlausulAnnexByStandar(standar)
      .subscribe(res => {
        this.refKlausulAnnexList = res.response.list;
      });
  }

  trackByRefId(_: number, item: any): number {
    return item.refPertanyaanAuditId;
  }
}
