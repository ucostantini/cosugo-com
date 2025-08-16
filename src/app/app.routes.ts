import { Routes } from '@angular/router';
import { About } from './common/components/about/about';
import {
  ComparisonTool
} from './features/product-nutrition-comparison/comparison-tool/comparison-tool.component';
import { Home } from './common/components/home/home';
import { NotFound } from './common/components/not-found/not-found';
import { License } from './common/components/license/license';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'about',
    component: About
  },
  {
    path: 'license',
    component: License
  },
  {
    path: 'nutrition',
    component: ComparisonTool
  },
  {
    path: '**',
    component: NotFound
  }
];
