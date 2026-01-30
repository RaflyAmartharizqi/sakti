import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPenilaianComponent } from './detail-penilaian.component';

describe('DetailPenilaianComponent', () => {
  let component: DetailPenilaianComponent;
  let fixture: ComponentFixture<DetailPenilaianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPenilaianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPenilaianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
