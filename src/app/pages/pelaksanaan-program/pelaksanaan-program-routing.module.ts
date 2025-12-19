import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'pengisian-smki',
        loadComponent: () =>
          import('./pengisian-smki/pengisian-smki.component')
            .then(m => m.PengisianSmkiComponent)
  },
  {
    path: 'pelaksanaan-iso',
        loadComponent: () =>
          import('./pelaksanaan-iso/pelaksanaan-iso.component')
            .then(m => m.PelaksanaanIsoComponent)
  },
  {
    path: 'penilaian-verifikasi',
        loadComponent: () =>
          import('./penilaian-verifikasi/penilaian-verifikasi.component')
            .then(m => m.PenilaianVerifikasiComponent)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PelaksanaanProgramRoutingModule { }
