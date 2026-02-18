import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportService } from './report.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-report',
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
    NgSelectModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  constructor(
      private reportService: ReportService,
      private modalService: NgbModal,
      private tokenStorageService: TokenStorageService
  ) {}

  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Monitoring dan Tindak Lanjut' },
      { label: 'Report' }
    ];
    this.userInfo = this.tokenStorageService.getUser();
    this.loadData();
    this.getStandarAssesment();
    this.getPeriode();
    this.getUnitKerja()
  }

  standarAssesment: any[] = [];
  unitKerja: any[] = [];
  periode: number[] = [];

  filters = {
    kodeUnitKerja: null as null | string,
    standarAssesmentId: null as null | number,
    periode: null as null | number,
    page: 1,
    limit: 10,
  }

  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  userInfo: any;

  isLoading = false;
  reportList: any[] = [];
  selectedFile: File | null = null;

  selectedProgramAuditId = null;
  selectedJadwalUnitKerjaAuditId = null;
  selectedAttachment = null;
  attachmentUrl = null;

  downloadExcel() {
    const params = {
      kodeUnitKerja: this.filters.kodeUnitKerja,
      standarAssesmentId: this.filters.standarAssesmentId,
      periode: this.filters.periode
    };
    this.reportService.downloadExcel(params).subscribe({
      next: (res) => {
        const blob = new Blob([res.body!], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const contentDisposition = res.headers.get('content-disposition');
        let filename = 'report.xlsx';
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    });
  }

  loadData() {
    if (this.userInfo.role == 'Asesi')
    {
      if (this.userInfo.kodeOffice == '00')
      {
        this.filters.kodeUnitKerja = this.userInfo.kodeUnitKerja;
      } else if (this.userInfo.kodeOffice != '00') {
        this.filters.kodeUnitKerja = this.userInfo.kodeOffice;
      }
    }
    this.isLoading = true;
    this.reportList= [];
    this.reportService.getReportList(this.filters).subscribe({
      next: (res) => {
        this.reportList = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.isLoading = false;
        console.log(this.reportList);
      }
    });
  }
  
  getStandarAssesment() {
    this.reportService.getStandarAssesment().subscribe({
      next: (res) => {
        this.standarAssesment = res.response.list;
      }
    });
  }

  getUnitKerja() {
    this.reportService.getUnitKerja().subscribe({
      next: (res) => {
        this.unitKerja = res.response.list;
      }
    });
  }

  getPeriode() {
    const currentYear = new Date().getFullYear() + 1;
    this.periode = [];
    for (let i = currentYear; i >= 2000; i--) {
      this.periode.push(i);
    }
  }

  downloadAttachment(attachmentId: number, data: any) {
    this.reportService.downloadAttachment(attachmentId).subscribe({
      next: (res) => {
        const blob = res.body!;
        const contentDisposition = res.headers.get('content-disposition');
        let extension = 'pdf';

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?(.+)"?/);
          if (match?.[1]) {
            const originalName = match[1];
            extension = originalName.split('.').pop() || 'pdf';
          }
        }
        const unitKerjaName = data.unitKerja?.[0]?.unitKerja || 'UnitKerja';
        const safeName = `${data.standarAssesment}_${data.periode}_${unitKerjaName}`
          .replace(/[/\\?%*:|"<>]/g, '_');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${safeName}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;

    if (file.type !== 'application/pdf') {
      Swal.fire({
        icon: 'error',
        title: 'Format salah',
        text: 'Hanya file PDF yang diperbolehkan'
      });
      event.target.value = null;
      return;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: 'warning',
        title: 'File terlalu besar',
        text: 'Ukuran maksimal 2 MB'
      });
      event.target.value = null;
      return;
    }

    this.selectedFile = file;
  }

  downloadDraft(data: any) {
    this.reportService
      .downloadDraft(data.programAuditId, data.unitKerja?.[0]?.jadwalUnitKerjaAuditId)
      .subscribe({
        next: (res) => {
          // 👉 pastikan blob Word
          const blob = new Blob([res.body!], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });

          const contentDisposition = res.headers.get('content-disposition');

          let extension = 'docx'; // default Word

          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match?.[1]) {
              extension = match[1].split('.').pop() || 'docx';
            }
          }

          const unitKerjaName =
            data.unitKerja?.[0]?.unitKerja || 'UnitKerja';

          const safeName = `Draft_${data.standarAssesment}_${data.periode}_${unitKerjaName}`
            .replace(/[/\\?%*:|"<>]/g, '_');

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = `${safeName}.${extension}`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Download gagal:', err);
        }
      });
  }

  uploadReport() {
    if (!this.selectedFile) {
      Swal.fire('Oops', 'Pilih file dulu', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('programAuditId', String(this.selectedProgramAuditId));
    formData.append('jadwalUnitKerjaAuditId', String(this.selectedJadwalUnitKerjaAuditId));
    formData.append('fileReport', this.selectedFile);

    this.isLoading = true;

    this.reportService.uploadReport(formData).subscribe({
      next: res => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'File berhasil diupload',
          timer: 500,
          showConfirmButton: false
        });

        this.modalService.dismissAll();
        this.loadData();
      },
      error: err => {
        this.isLoading = false;
        Swal.fire('Gagal', 'Upload gagal', 'error');
      }
    });
  }


  openModal(content: any, data: any) {
    const firstUnit = data.unitKerja?.[0];
    this.selectedProgramAuditId = data.programAuditId;
    this.selectedJadwalUnitKerjaAuditId = firstUnit.jadwalUnitKerjaAuditId;
    this.selectedAttachment = data.attachment ?? null;
    this.attachmentUrl = data.attachment?.url ?? null;
    this.selectedFile = data.attachment?.storedFileName ?? null;
    this.modalService.open(content, { size: 'lg', centered: true });
  }


  onFiltersChange() {
    this.loadData();
  }
}
