import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNutritionComparison } from './product-nutrition-comparison';

describe('ProductNutritionComparison', () => {
  let component: ProductNutritionComparison;
  let fixture: ComponentFixture<ProductNutritionComparison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductNutritionComparison]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductNutritionComparison);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
