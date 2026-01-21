import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSmkiComponent } from './detail-smki.component';

describe('DetailSmkiComponent', () => {
  let component: DetailSmkiComponent;
  let fixture: ComponentFixture<DetailSmkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSmkiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSmkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
