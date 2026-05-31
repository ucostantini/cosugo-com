import { Component, inject, OnInit } from '@angular/core';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { Recipe } from '../data';
import { LocalStorageService } from '../../../common/services/local-storage-service';

@Component({
  selector: 'app-recipe-cost-calculator',
  imports: [
    RecipeFormComponent
  ],
  templateUrl: './recipe-cost-calculator.component.html',
  styleUrl: './recipe-cost-calculator.component.scss'
})
export class RecipeCostCalculator implements OnInit {
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  recipes: Recipe[] = [];

  ngOnInit(): void {
    this.recipes = this.localStorageService.getItem<Recipe[]>('recipeCost') ?? [];
  }

  onRecipeAdd($event: Recipe) {
    this.recipes.push($event);
    this.localStorageService.setItem('recipeCost', this.recipes);
  }

  getPriceForRecipe(i: number) {
    return this.recipes[i].ingredients.reduce((acc, curr) => acc + curr.price / (curr.quantity / curr.quantityUsed), 0);
  }

  getPriceForRecipePerServingSize(i: number) {
    return this.recipes[i].servingSize ? (this.getPriceForRecipe(i) * this.recipes[i].servingSize) : this.getPriceForRecipe(i);
  }
}
