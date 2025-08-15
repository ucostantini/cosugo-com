import { Routes } from '@angular/router';
import { About } from './common/components/about/about';
import {
  ProductNutritionComparison
} from './features/product-nutrition-comparison/product-nutrition-comparison/product-nutrition-comparison';

export const routes: Routes = [
  {
    path: '',
    component: ProductNutritionComparison
  },
  {
    path: 'about',
    component: About
  },
  {
    path: 'nutrition',
    component: ProductNutritionComparison
  }
];
