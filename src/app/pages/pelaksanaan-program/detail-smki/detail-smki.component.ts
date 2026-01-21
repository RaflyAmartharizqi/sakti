import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
// import { PengisianSmkiService } from '../pengisian-smki.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { DetailSmkiService } from './detail-smki.service';

@Component({
  selector: 'app-list-bidang',
  standalone: true,
  imports: [CommonModule, SharedModule, NgSelectModule, FormsModule, FlatpickrModule, RouterModule, NgbTooltipModule],
  templateUrl: './detail-smki.component.html',
  styleUrl: './detail-smki.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class DetailSmkiComponent {
   constructor(
    private route: ActivatedRoute,
    private detailSmkiService: DetailSmkiService,
    private tokenStorageService: TokenStorageService
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Pengisian Assesment SMKI' },
      { label: 'Detail SMKI', active: true }
    ];
    this.route.paramMap.subscribe(params => {
      this.parameters.jadwalUnitKerjaAuditId = Number(params.get('jadwalUnitKerjaAuditId'));
      this.parameters.kodeBidang = this.tokenStorageService.getUser().kodeUnitKerja;
      this.loadData();
    });
  }
  isLoading = false;
  listBidang: any[] = [];
  jadwalUnitKerjaAuditId!: number;
  parameters = {
    jadwalUnitKerjaAuditId: this.jadwalUnitKerjaAuditId,
    kodeBidang: ''
  }

  loadData() {
    this.isLoading = true;
    this.listBidang = [];
    this.detailSmkiService.getListByBidang(this.parameters).subscribe({
      next: (res) => {
        this.listBidang = res.response.list;
        this.isLoading = false;
      }
    });
  }
}
