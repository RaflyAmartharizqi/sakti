import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-pelaksanaan-iso',
  standalone: true,
  imports: [CommonModule, SharedModule ],
  templateUrl: './pelaksanaan-iso.component.html',
  styleUrl: './pelaksanaan-iso.component.scss'
})
export class PelaksanaanIsoComponent implements OnInit {
    constructor(
    // private modalService: NgbModal,
    // private programAuditService: ProgramAudit
  ) {}
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pelaksanaan Program' },
      { label: 'Pelaksanaan Audit ISO', active: true }
    ];
    // this.loadData();
    // this.getStandarAssesment();
    // this.getUnitkerja();
  }
}
