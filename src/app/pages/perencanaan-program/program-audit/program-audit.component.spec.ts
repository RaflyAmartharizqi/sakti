import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramAuditComponent } from './program-audit.component';

describe('ProgramAuditComponent', () => {
  let component: ProgramAuditComponent;
  let fixture: ComponentFixture<ProgramAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramAuditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
