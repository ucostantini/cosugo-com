import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSlider } from './govuk-slider';

describe('GovukSlider', () => {
  let component: GovukSlider;
  let fixture: ComponentFixture<GovukSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovukSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
