import { Component, inject, OnInit } from '@angular/core';
import { Product, NormalizedProduct } from '../data';
import { ProductForm } from '../product-form/product-form.component';
import { LocalStorageService } from '../../../common/services/local-storage-service';

@Component({
  selector: 'app-comparison-tool',
  imports: [
    ProductForm
  ],
  templateUrl: './comparison-tool.component.html',
  styleUrl: './comparison-tool.component.scss'
})
export class ComparisonTool implements OnInit {
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  protected products: NormalizedProduct[] = [];

  ngOnInit(): void {
    this.products = this.localStorageService.getItem<NormalizedProduct[]>('productFacts') ?? [];
  }

  onProductAdd($event: Product) {
    this.calculateFacts($event);
  }

  onDeleteProduct($index: number) {
    this.products.splice($index, 1);
    this.localStorageService.setItem('productFacts', this.products);
  }

  private calculateFacts(product: Product): void {
    const ratio = product.servingSize / 100;
    const numOfServings = product.weight / product.servingSize;
    this.products.push({
      name: product.name,
      caloriesPer100g: (product.calories / ratio).toFixed(0),
      proteinsPer100g: (product.proteins / ratio).toFixed(0),
      caloriesPerCurrency: ((product.calories * numOfServings) / product.price).toFixed(0),
      proteinsPerCurrency: ((product.proteins * numOfServings) / product.price).toFixed(0)
    });
    this.localStorageService.setItem('productFacts', this.products);
  }
}
