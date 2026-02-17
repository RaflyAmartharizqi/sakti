import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: 'audit-log',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./audit-log/audit-log.component')
            .then(m => m.AuditLogComponent),
          canActivate: [RoleGuard], data: { role: ['Admin', 'Asesor', 'Asesi'] }
      },
      {
        path: 'tindak-lanjut/:jadwalUnitKerjaAuditId',
        loadComponent: () =>
          import('./tindak-lanjut/tindak-lanjut.component')
            .then(m => m.TindakLanjutComponent),
            canActivate: [RoleGuard], data: { role: ['Admin', 'Asesor', 'Asesi'] }
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
            .then(m => m.ReportComponent),
            canActivate: [RoleGuard], data: { role: ['Admin', 'Asesor', 'Asesi'] }
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
            .then(m => m.UmpanBalikComponent),
            canActivate: [RoleGuard], data: { role: ['Admin'] }
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MonitoringTindakLanjutRoutingModule { }
