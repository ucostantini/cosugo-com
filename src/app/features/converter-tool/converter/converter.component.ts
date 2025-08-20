import { Component, inject } from '@angular/core';
import { ProductForm } from "../../product-nutrition-comparison/product-form/product-form.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyService } from '../currency.service';

@Component({
  selector: 'app-converter.component',
  imports: [
    ProductForm,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent {
  protected currencyService: CurrencyService = inject(CurrencyService);

  protected readonly Object = Object;
}
