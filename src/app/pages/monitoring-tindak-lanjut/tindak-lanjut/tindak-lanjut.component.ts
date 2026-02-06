import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { TindakLanjutService } from './tindak-lanjut.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tindak-lanjut',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    FlatpickrModule,
    RouterModule,  
    NgSelectModule,
    NgbModule,
  ],
  templateUrl: './tindak-lanjut.component.html',
  styleUrl: './tindak-lanjut.component.scss'
})
export class TindakLanjutComponent {
    constructor(
      private modalService: NgbModal,
      private route: ActivatedRoute,
      private tindakLanjutService: TindakLanjutService,
      private tokenStorageService: TokenStorageService
  ) {}

  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Monitoring dan Tindak Lanjut' },
      { label: 'Tindak Lanjut' }
    ];
    this.role = this.tokenStorageService.getUser().role;
    this.route.paramMap.subscribe(params => {
      this.jadwalUnitKerjaAuditId = Number(params.get('jadwalUnitKerjaAuditId'));
      this.loadData();
      this.getRating();
    });
  }

  isLoading= false;
  tindakLanjut: any[] = [];
  jadwalUnitKerjaAuditId= 0;
  loadData() {
    this.isLoading = true;
    this.tindakLanjut = [];
    this.tindakLanjutService.getPertanyaanTindakLanjut(this.jadwalUnitKerjaAuditId).subscribe({
      next: (res) => {
        this.tindakLanjut = res.response.list;
        this.isLoading = false;
        console.log(this.tindakLanjut);
      }
    });
  }

  selectedData: any;
  role= '';
  rating: any[] = [];

  form: any = {
    rootCause: '',
    correction: '',
    correctiveAction: '',
    dueDate: '',
    ratingId: '',
    catatan: ''
  };

  openEdit(content: any, data: any) {
    this.selectedData = data;

    this.form = {
      rootCause: data.rootCause ?? '',
      correction: data.correction ?? '',
      correctiveAction: data.correctiveAction ?? '',
      dueDate: data.dueDate
        ? new Date(data.dueDate).toISOString().split('T')[0]
        : ''    };
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openReview(content: any, data: any) {
    this.selectedData = data;

    this.form = {
      rootCause: data.rootCause ?? '',
      correction: data.correction ?? '',
      correctiveAction: data.correctiveAction ?? '',
      ratingId: data.ratingId ?? '',
      catatan: data.catatan ?? '',
      dueDate: data.dueDate
        ? new Date(data.dueDate).toISOString().split('T')[0]
        : ''
    };

    this.modalService.open(content, { size: 'lg', centered: true });
  }

  updateTL(modal: any) {

    const payload = {
      transaksiAuditJawabanId: this.selectedData.transaksiAuditJawabanId,
      rootCause: this.form.rootCause,
      correction: this.form.correction,
      correctiveAction: this.form.correctiveAction,
      dueDate: this.form.dueDate,
    };

    this.tindakLanjutService.saveTindakLanjut(payload).subscribe({
      next: () => {
        modal.close();
        this.loadData();
      }
    });
  }


  submitReview(modal: any) {
    const payload = {
      transaksiAuditJawabanId: this.selectedData.transaksiAuditJawabanId,
      transaksiAuditTindakLanjutId: this.selectedData.transaksiAuditTindakLanjutId,
      ratingId: Number(this.form.ratingId),
      catatan: this.form.catatan,
    };

    this.tindakLanjutService.reviewTindakLanjut(payload).subscribe({
      next: () => {
        modal.close();
        this.loadData();
      }
    });
  }

  getUniqueTransaksiIds(): number[] {
    const ids = this.tindakLanjut.map(x => x.transaksiAuditId);
    return [...new Set(ids)];
  }

  kirimKeAsesor() {
    const transaksiAuditId = this.getUniqueTransaksiIds();
    if (!transaksiAuditId.length) return;

    const payload = {
      transaksiAuditId: transaksiAuditId
    };

    Swal.fire({
      title: 'Kirim ke Asesor?',
      text: 'Pastikan semua tindak lanjut sudah diisi',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, kirim!',
      cancelButtonText: 'Batal',

      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),

      preConfirm: () => {
        return this.tindakLanjutService.kirimKeAsesor(payload).toPromise().then(
          () => true,
          (err) => {
            Swal.showValidationMessage(
              err?.error?.metadata?.message || 'Terjadi kesalahan'
            );
            return false;
          }
        );
      }


    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data berhasil dikirim ke asesor'
        });

        this.loadData();
      }
    });

  }

  kirimKeAsesi() {
    const transaksiAuditId = this.getUniqueTransaksiIds();
    if (!transaksiAuditId.length) return;

    const payload = {
      transaksiAuditId: transaksiAuditId
    };

    Swal.fire({
      title: 'Kirim ke Asesi?',
      text: 'Pastikan semua tindak lanjut sudah diisi',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, kirim!',
      cancelButtonText: 'Batal',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),

      preConfirm: () => {
        this.isLoading = true;

        return this.tindakLanjutService.kirimKeAsesi(payload)
          .toPromise()
          .then(() => {
            this.loadData();
          })
          .catch((err) => {
            Swal.showValidationMessage(
              err?.error?.metadata?.message || 'Gagal kirim data'
            );
          })
          .finally(() => {
            this.isLoading = false;
          });
      }

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Berhasil!', 'Data berhasil dikirim', 'success');
      }
    });

  }


  getRating(): void {
    this.tindakLanjutService.getRating().subscribe({
      next: (res) => {
        this.rating = res.response.list;
      },
    });
  }

  canSendToAsesor(): boolean {
    return this.role === 'Asesi' &&
      this.tindakLanjut.some(d => d.statusAuditId === 3 || d.statusAuditId === 4);
  }
  
  canSendToAsesi(): boolean {
    return this.role === 'Asesor' &&
      this.tindakLanjut.some(d => d.statusAuditId === 5);
  }



}
