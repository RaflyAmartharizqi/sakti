import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiKlausulAnnexComponent } from './referensi-klausul-annex.component';

describe('ReferensiKlausulAnnexComponent', () => {
  let component: ReferensiKlausulAnnexComponent;
  let fixture: ComponentFixture<ReferensiKlausulAnnexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferensiKlausulAnnexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferensiKlausulAnnexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
