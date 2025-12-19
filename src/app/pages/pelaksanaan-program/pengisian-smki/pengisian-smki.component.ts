import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-pengisian-smki',
  standalone: true,
  imports: [CommonModule, SharedModule ],
  templateUrl: './pengisian-smki.component.html',
  styleUrl: './pengisian-smki.component.scss'
})
export class PengisianSmkiComponent implements OnInit {
  constructor(
    // private modalService: NgbModal,
    // private programAuditService: ProgramAudit
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Pengisian Assesment SMKI', active: true }
    ];
    // this.loadData();
    // this.getStandarAssesment();
    // this.getUnitkerja();
  }
}
