import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AktivasiUserComponent } from './aktivasi-user/aktivasi-user.component';
import { ReferensiKlausulAnnexComponent } from './referensi-klausul-annex/referensi-klausul-annex.component';
const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'aktivasi-user', component: AktivasiUserComponent },
      { path: 'referensi-klausul-annex', component: ReferensiKlausulAnnexComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PengaturanRoutingModule { }
