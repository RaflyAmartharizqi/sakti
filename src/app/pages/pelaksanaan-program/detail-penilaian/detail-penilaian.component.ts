import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { DetailSmkiService } from '../detail-smki/detail-smki.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailPenilaianService } from './detail-penilaian.service';

@Component({
  selector: 'app-detail-penilaian',
  standalone: true,
  imports: [CommonModule, SharedModule, FlatpickrModule, RouterModule, NgbTooltipModule],
  templateUrl: './detail-penilaian.component.html',
  styleUrl: './detail-penilaian.component.scss'
})
export class DetailPenilaianComponent implements OnInit {
  constructor(
        private route: ActivatedRoute,
        private detailPenilaianService: DetailPenilaianService,
        private tokenStorageService: TokenStorageService
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Penilaian atau Verifikasi' },
      { label: 'Detail Penilaian', active: true }
    ];
    this.route.paramMap.subscribe(params => {
      this.parameters.jadwalUnitKerjaAuditId = Number(params.get('jadwalUnitKerjaAuditId'));
      console.log(this.parameters.jadwalUnitKerjaAuditId);
      this.loadData();
    });
  }
  isLoading = false;
  listBidang: any[] = [];
  parameters = {
    jadwalUnitKerjaAuditId: null as number | null,
  }

  loadData() {
    this.isLoading = true;
    this.listBidang = [];
    this.detailPenilaianService.getListDetailPenilaian(this.parameters).subscribe({
      next: (res) => {
        this.listBidang = res.response.list;
        this.isLoading = false;
      }
    });
  }
}
