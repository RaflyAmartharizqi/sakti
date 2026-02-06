import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmpanBalikComponent } from './umpan-balik.component';

describe('UmpanBalikComponent', () => {
  let component: UmpanBalikComponent;
  let fixture: ComponentFixture<UmpanBalikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UmpanBalikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UmpanBalikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
