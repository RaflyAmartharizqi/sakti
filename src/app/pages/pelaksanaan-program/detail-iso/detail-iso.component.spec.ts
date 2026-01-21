import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIsoComponent } from './detail-iso.component';

describe('DetailIsoComponent', () => {
  let component: DetailIsoComponent;
  let fixture: ComponentFixture<DetailIsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailIsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailIsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
