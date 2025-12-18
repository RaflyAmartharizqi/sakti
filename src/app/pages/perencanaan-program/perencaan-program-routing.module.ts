import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'program-audit',
        loadComponent: () =>
          import('./program-audit/program-audit.component')
            .then(m => m.ProgramAuditComponent)
  },
  {
    path: 'jadwal-audit/:programAuditId',
        loadComponent: () =>
          import('./jadwal-audit/jadwal-audit.component')
            .then(m => m.JadwalAuditComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PerencanaanProgramRoutingModule { }
