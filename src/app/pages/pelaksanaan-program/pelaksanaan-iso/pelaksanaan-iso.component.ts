import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PelaksanaanIsoService } from './pelaksanaan-iso.service';
import { FlatpickrModule } from 'angularx-flatpickr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pelaksanaan-iso',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './pelaksanaan-iso.component.html',
  styleUrl: './pelaksanaan-iso.component.scss'
})
export class PelaksanaanIsoComponent implements OnInit {
  constructor(
    private pelaksanaanIsoService: PelaksanaanIsoService,
    private tokenStorageService: TokenStorageService
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Pelaksanaan Audit ISO', active: true }
    ];
    this.kodeUnitKerja = this.tokenStorageService.getUser().kodeUnitKerja;
    this.loadData();
  }
  programAuditId!: number;

  searchQuery = '';
  entriesPerPage = 10;
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
    programAuditId: null as number | null,
  }

  kodeUnitKerja= '';
  jadwalAudit: any[] = [];

  loadData() {
    this.isLoading = true;
    this.jadwalAudit = [];
    this.pelaksanaanIsoService.getJadwalAuditByKodeUnitKerja().subscribe({
      next: (res) => {
        this.jadwalAudit = res.response.list;
        this.totalData = res.response.totalData;
        this.totalPage = res.response.totalPage;
        this.from = res.response.from;
        this.to = res.response.to;
        this.currentPage = res.response.page;
        this.isLoading = false;
      }
    });
  }
}
