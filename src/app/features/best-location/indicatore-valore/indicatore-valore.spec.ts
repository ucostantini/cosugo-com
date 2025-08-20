import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatoreValore } from './indicatore-valore';

describe('IndicatoreValore', () => {
  let component: IndicatoreValore;
  let fixture: ComponentFixture<IndicatoreValore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatoreValore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatoreValore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
