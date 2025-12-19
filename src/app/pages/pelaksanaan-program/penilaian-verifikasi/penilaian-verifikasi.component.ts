import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-penilaian-verifikasi',
  standalone: true,
  imports: [CommonModule, SharedModule ],
  templateUrl: './penilaian-verifikasi.component.html',
  styleUrl: './penilaian-verifikasi.component.scss'
})
export class PenilaianVerifikasiComponent implements OnInit {
  constructor(
    // private modalService: NgbModal,
    // private programAuditService: ProgramAudit
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Penilaian atau Verifikasi', active: true }
    ];
    // this.loadData();
    // this.getStandarAssesment();
    // this.getUnitkerja();
  }
}
