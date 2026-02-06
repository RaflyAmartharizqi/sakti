import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'audit-log',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./audit-log/audit-log.component')
            .then(m => m.AuditLogComponent)
      },
      {
        path: 'tindak-lanjut/:jadwalUnitKerjaAuditId',
        loadComponent: () =>
          import('./tindak-lanjut/tindak-lanjut.component')
            .then(m => m.TindakLanjutComponent)
      },
    ]
  },
  {
    path: 'report',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./report/report.component')
            .then(m => m.ReportComponent)
      }
    ]
  },
  {
    path: 'umpan-balik-assesment',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./umpan-balik/umpan-balik.component')
            .then(m => m.UmpanBalikComponent)
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MonitoringTindakLanjutRoutingModule { }
