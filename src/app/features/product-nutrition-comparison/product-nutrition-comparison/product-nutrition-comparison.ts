import { Component } from '@angular/core';
import { Product, ProductNutritionFactsComparison } from '../data';
import { ProductTracker } from '../../../components/product-tracker/product-tracker';

@Component({
  selector: 'app-product-nutrition-comparison',
  imports: [
    ProductTracker
  ],
  templateUrl: './product-nutrition-comparison.html',
  styleUrl: './product-nutrition-comparison.scss'
})
export class ProductNutritionComparison {
  protected products: ProductNutritionFactsComparison[] = [];

  onProductAdd($event: Product) {
    this.calculateFacts($event);
  }

  private calculateFacts(product: Product): void {
    const ratio = product.servingSize / 100;
    this.products.push({
      name: product.name,
      caloriesPer100g: (product.calories / ratio).toFixed(0),
      proteinsPer100g: (product.proteins / ratio).toFixed(0),
      caloriesPerCurrency: (product.calories / product.price).toFixed(0),
      proteinsPerCurrency: (product.proteins / product.price).toFixed(0)
    });
  }
}
