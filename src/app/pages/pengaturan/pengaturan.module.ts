import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  NgbToastModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { CountUpModule } from 'ngx-countup';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SimplebarAngularModule } from 'simplebar-angular';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

//Module
import { PengaturanRoutingModule } from "./pengaturan-routing.module";
import { SharedModule } from '../../shared/shared.module';
import { ReferensiKlausulAnnexComponent } from './referensi-klausul-annex/referensi-klausul-annex.component';
import { AktivasiUserComponent } from './aktivasi-user/aktivasi-user.component';
import { ReferensiPertanyaanSmkiComponent } from './referensi-pertanyaan-smki/referensi-pertanyaan-smki.component';
import { ReferensiPertanyaanAuditIsoComponent } from './referensi-pertanyaan-audit-iso/referensi-pertanyaan-audit-iso.component';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ReferensiKlausulAnnexComponent,
    ReferensiPertanyaanSmkiComponent,
    ReferensiPertanyaanAuditIsoComponent,
  ],
  imports: [
    CommonModule,
    NgbToastModule,
    FeatherModule.pick(allIcons),
    CountUpModule,
    LeafletModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgApexchartsModule,
    SlickCarouselModule,
    FlatpickrModule.forRoot(),
    PengaturanRoutingModule,
    SharedModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbModalModule,
    NgSelectModule,
    FormsModule,
    AsyncPipe,
    AktivasiUserComponent,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PengaturanModule { }
