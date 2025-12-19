import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenilaianVerifikasiComponent } from './penilaian-verifikasi.component';

describe('PenilaianVerifikasiComponent', () => {
  let component: PenilaianVerifikasiComponent;
  let fixture: ComponentFixture<PenilaianVerifikasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenilaianVerifikasiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenilaianVerifikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
