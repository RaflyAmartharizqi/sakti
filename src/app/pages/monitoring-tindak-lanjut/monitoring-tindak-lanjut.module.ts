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
import { MonitoringTindakLanjutRoutingModule } from "./monitoring-tindak-lanjut-routing.module";
import { SharedModule } from '../../shared/shared.module';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
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
    MonitoringTindakLanjutRoutingModule,
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
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MonitoringTindakLanjutModule { }
