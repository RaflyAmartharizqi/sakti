import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesIsoComponent } from './asses-iso.component';

describe('AssesIsoComponent', () => {
  let component: AssesIsoComponent;
  let fixture: ComponentFixture<AssesIsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesIsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesIsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
