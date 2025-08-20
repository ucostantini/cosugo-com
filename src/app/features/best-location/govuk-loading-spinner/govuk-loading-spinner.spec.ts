import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukLoadingSpinner } from './govuk-loading-spinner';

describe('GovukLoadingSpinner', () => {
  let component: GovukLoadingSpinner;
  let fixture: ComponentFixture<GovukLoadingSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukLoadingSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovukLoadingSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
