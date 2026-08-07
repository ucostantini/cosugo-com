import { Pipe, PipeTransform } from '@angular/core';
import { NormalizedProduct, Product } from './data';

@Pipe({
  name: 'normalizeProduct'
})
export class NormalizeProductPipe implements PipeTransform {

  transform(product: Product): NormalizedProduct {
    const ratio = product.servingSize / 100;
    const numOfServings = product.weight / product.servingSize;

    return {
      name: product.name,
      caloriesPer100g: (product.calories / ratio).toFixed(0),
      proteinsPer100g: (product.proteins / ratio).toFixed(0),
      caloriesPerCurrency: ((product.calories * numOfServings) / product.price).toFixed(0),
      proteinsPerCurrency: ((product.proteins * numOfServings) / product.price).toFixed(0)
    };
  }

}
