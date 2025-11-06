import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AktivasiUserComponent } from './aktivasi-user/aktivasi-user.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'aktivasi-user', component: AktivasiUserComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PengaturanRoutingModule { }
