import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TindakLanjutComponent } from './tindak-lanjut.component';

describe('TindakLanjutComponent', () => {
  let component: TindakLanjutComponent;
  let fixture: ComponentFixture<TindakLanjutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TindakLanjutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TindakLanjutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
