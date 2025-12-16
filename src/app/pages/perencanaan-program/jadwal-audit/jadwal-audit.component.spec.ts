import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JadwalAuditComponent } from './jadwal-audit.component';

describe('JadwalAuditComponent', () => {
  let component: JadwalAuditComponent;
  let fixture: ComponentFixture<JadwalAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JadwalAuditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JadwalAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
