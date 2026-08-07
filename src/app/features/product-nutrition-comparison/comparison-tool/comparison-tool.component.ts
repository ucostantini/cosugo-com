import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { Product, NormalizedProduct } from '../data';
import { ProductForm } from '../product-form/product-form.component';
import { LocalStorageService } from '../../../common/services/local-storage-service';
import { NormalizeProductPipe } from '../normalize-product-pipe';


@Component({
  selector: 'app-comparison-tool',
  imports: [
    ProductForm,
    NormalizeProductPipe
  ],
  templateUrl: './comparison-tool.component.html',
  styleUrl: './comparison-tool.component.scss'
})
export class ComparisonTool implements OnInit {
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  protected products: Map<string, Product> = new Map();
  selectedProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.products = this.localStorageService.getItem<Map<string, Product>>('productFacts') ?? new Map();
  }

  onProductAdd($event: Product) {
    this.products.set($event.name, $event);
    this.localStorageService.setItem('productFacts', this.products);
  }

  onDeleteProduct(productName: string) {
    this.products.delete(productName);
    this.localStorageService.setItem('productFacts', this.products);
  }

  onEditProduct(productName: string) {
    this.selectedProduct.set({...this.products.get(productName)!});
  }
}
