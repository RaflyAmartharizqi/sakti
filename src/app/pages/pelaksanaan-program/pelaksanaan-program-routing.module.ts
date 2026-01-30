import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'pengisian-smki',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pengisian-smki/pengisian-smki.component')
            .then(m => m.PengisianSmkiComponent)
      },
      {
        path: 'detail-smki/:jadwalUnitKerjaAuditId',
        loadComponent: () =>
          import('./detail-smki/detail-smki.component')
            .then(m => m.DetailSmkiComponent)
      },
      {
        path: 'asses-smki/:transaksiAuditId',
        loadComponent: () =>
          import('./asses-smki/asses-smki.component')
            .then(m => m.AssesSmkiComponent)
      }
    ]
  },
  {
    path: 'pelaksanaan-iso',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pelaksanaan-iso/pelaksanaan-iso.component')
            .then(m => m.PelaksanaanIsoComponent)
      },
      {
        path: 'detail-iso/:programAuditId',
        loadComponent: () =>
          import('./detail-iso/detail-iso.component')
            .then(m => m.DetailIsoComponent)
      },
      {
        path: 'asses-iso/:transaksiAuditId',
        loadComponent: () =>
          import('./asses-iso/asses-iso.component')
            .then(m => m.AssesIsoComponent)
      }
    ]
  },
  {
    path: 'penilaian-verifikasi',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./penilaian-verifikasi/penilaian-verifikasi.component')
            .then(m => m.PenilaianVerifikasiComponent)
      },
      {
        path: 'detail-penilaian/:jadwalUnitKerjaAuditId',
        loadComponent: () =>
          import('./detail-penilaian/detail-penilaian.component')
            .then(m => m.DetailPenilaianComponent)
      },
      {
        path: 'asses-penilaian/:transaksiAuditId',
        loadComponent: () =>
          import('./asses-penilaian/asses-penilaian.component')
            .then(m => m.AssesPenilaianComponent)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PelaksanaanProgramRoutingModule { }
