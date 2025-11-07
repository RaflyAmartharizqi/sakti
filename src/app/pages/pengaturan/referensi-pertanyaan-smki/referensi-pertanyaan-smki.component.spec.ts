import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiPertanyaanSmkiComponent } from './referensi-pertanyaan-smki.component';

describe('ReferensiPertanyaanSmkiComponent', () => {
  let component: ReferensiPertanyaanSmkiComponent;
  let fixture: ComponentFixture<ReferensiPertanyaanSmkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferensiPertanyaanSmkiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferensiPertanyaanSmkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
