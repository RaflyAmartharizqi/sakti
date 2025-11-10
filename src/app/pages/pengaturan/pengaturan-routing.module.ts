import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AktivasiUserComponent } from './aktivasi-user/aktivasi-user.component';
import { ReferensiKlausulAnnexComponent } from './referensi-klausul-annex/referensi-klausul-annex.component';
import { ReferensiPertanyaanSmkiComponent } from './referensi-pertanyaan-smki/referensi-pertanyaan-smki.component';
import { ReferensiPertanyaanAuditIsoComponent } from './referensi-pertanyaan-audit-iso/referensi-pertanyaan-audit-iso.component';
  
const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'aktivasi-user', component: AktivasiUserComponent },
      { path: 'referensi-klausul-annex', component: ReferensiKlausulAnnexComponent },
      { path: 'referensi-pertanyaan-smki', component: ReferensiPertanyaanSmkiComponent },
      { path: 'referensi-pertanyaan-audit-iso', component: ReferensiPertanyaanAuditIsoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PengaturanRoutingModule { }
