import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PenilaianVerifikasiService } from './penilaian-verifikasi.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-penilaian-verifikasi',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule ],
  templateUrl: './penilaian-verifikasi.component.html',
  styleUrl: './penilaian-verifikasi.component.scss'
})
export class PenilaianVerifikasiComponent implements OnInit {
  constructor(
    // private modalService: NgbModal,
    private penilaianVerifikasiService: PenilaianVerifikasiService
  ) {}
  breadCrumbItems!: Array<{}>;
  penilaianSmki: any[] = [];
  isLoading = false;
  totalData = 0;
  totalPage = 0;
  from = 0;
  to = 0;
  currentPage = 0;
  filters = {
    page: 1,
    limit: 10,
    periode: null as number | null,
    search: ''
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Penilaian atau Verifikasi', active: true }
    ];
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.penilaianSmki = [];
    this.penilaianVerifikasiService.getListPenilaianSmki(this.filters).subscribe({
      next: (res) => {
        this.penilaianSmki = res.response.list;
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
