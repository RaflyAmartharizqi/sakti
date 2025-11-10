import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiPertanyaanAuditIsoComponent } from './referensi-pertanyaan-audit-iso.component';

describe('ReferensiPertanyaanAuditIsoComponent', () => {
  let component: ReferensiPertanyaanAuditIsoComponent;
  let fixture: ComponentFixture<ReferensiPertanyaanAuditIsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferensiPertanyaanAuditIsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferensiPertanyaanAuditIsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
