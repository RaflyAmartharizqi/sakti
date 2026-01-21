import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesSmkiComponent } from './asses-smki.component';

describe('AssesSmkiComponent', () => {
  let component: AssesSmkiComponent;
  let fixture: ComponentFixture<AssesSmkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesSmkiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesSmkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
