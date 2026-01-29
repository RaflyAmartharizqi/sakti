import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailIsoService } from './detail-iso.service';

@Component({
  selector: 'app-detail-iso',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, NgbTooltipModule],
  templateUrl: './detail-iso.component.html',
  styleUrl: './detail-iso.component.scss'
})
export class DetailIsoComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private detailIsoService: DetailIsoService,
    private tokenStorageService: TokenStorageService
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Pelaksanaan Audit ISO', active: true }
    ];
    this.route.paramMap.subscribe(params => {
      this.parameters.programAuditId = Number(params.get('programAuditId'));
      this.loadData();
    });
  }
  listDetailIso: any[] = [];
  parameters = {
    programAuditId: 0,
  }

  isLoading = false;
  jadwalUnitKerjaAuditId!: number;

  loadData() {
    this.isLoading = true;
    this.listDetailIso = [];
    this.detailIsoService.getListDetailIso(this.parameters).subscribe({
      next: (res) => {
        this.listDetailIso = res.response.list;
        this.isLoading = false;
      }
    });
  }



  
}
