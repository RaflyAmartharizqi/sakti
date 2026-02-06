import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";
import { AktivasiUserComponent } from './pengaturan/aktivasi-user/aktivasi-user.component';
import { ReferensiKlausulAnnexComponent } from './pengaturan/referensi-klausul-annex/referensi-klausul-annex.component';
const routes: Routes = [
    {
        path: "",
        component: DashboardComponent
    },
    {
      path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
    },
    {
      path: 'pengaturan', loadChildren: () => import('./pengaturan/pengaturan.module').then(m => m.PengaturanModule)
    },
    {
      path: 'perencanaan-program', loadChildren: () => import('./perencanaan-program/perencanaan-program.module').then(m => m.PerencanaanProgramModule)
    },
    {
      path: 'pelaksanaan-program', loadChildren: () => import('./pelaksanaan-program/pelaksanaan-program.module').then(m => m.PelaksanaanProgramModule)
    },
    {
      path: 'monitoring-tindak-lanjut', loadChildren: () => import('./monitoring-tindak-lanjut/monitoring-tindak-lanjut.module').then(m => m.MonitoringTindakLanjutModule)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
