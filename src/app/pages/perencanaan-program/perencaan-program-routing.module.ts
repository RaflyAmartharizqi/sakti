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
    path: 'jadwal-audit',
        loadComponent: () =>
          import('./jadwal/jadwal.component')
            .then(m => m.JadwalComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PerencanaanProgramRoutingModule { }
