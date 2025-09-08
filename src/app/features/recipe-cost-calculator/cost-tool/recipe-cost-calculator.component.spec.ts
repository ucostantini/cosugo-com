import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCostCalculator } from './recipe-cost-calculator';

describe('RecipeCostCalculator', () => {
  let component: RecipeCostCalculator;
  let fixture: ComponentFixture<RecipeCostCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCostCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeCostCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
