import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengisianSmkiComponent } from './pengisian-smki.component';

describe('PengisianSmkiComponent', () => {
  let component: PengisianSmkiComponent;
  let fixture: ComponentFixture<PengisianSmkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PengisianSmkiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PengisianSmkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
