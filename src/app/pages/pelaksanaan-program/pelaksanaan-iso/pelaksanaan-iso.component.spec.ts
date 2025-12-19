import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PelaksanaanIsoComponent } from './pelaksanaan-iso.component';

describe('PelaksanaanIsoComponent', () => {
  let component: PelaksanaanIsoComponent;
  let fixture: ComponentFixture<PelaksanaanIsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PelaksanaanIsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PelaksanaanIsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
