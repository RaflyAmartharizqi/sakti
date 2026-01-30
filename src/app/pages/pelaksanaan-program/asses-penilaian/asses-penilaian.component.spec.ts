import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesPenilaianComponent } from './asses-penilaian.component';

describe('AssesPenilaianComponent', () => {
  let component: AssesPenilaianComponent;
  let fixture: ComponentFixture<AssesPenilaianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesPenilaianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesPenilaianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
