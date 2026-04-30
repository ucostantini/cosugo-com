import { Component } from '@angular/core';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { Recipe } from '../data';
import { GovukAccordionDirective } from '../../../common/directives/govuk-accordion-directive';
import { Question } from '../../usa-civics-test/question/question';

@Component({
  selector: 'app-recipe-cost-calculator',
  imports: [
    RecipeFormComponent,
    GovukAccordionDirective
  ],
  templateUrl: './recipe-cost-calculator.component.html',
  styleUrl: './recipe-cost-calculator.component.scss'
})
export class RecipeCostCalculator {
  recipes: Recipe[] = [];

  onRecipeAdd($event: Recipe) {
    this.recipes.push($event);
  }

  getPriceForRecipe(i: number) {
    return this.recipes[i].ingredients.reduce((acc, curr) => acc + curr.price / (curr.quantity / curr.quantityUsed), 0);
  }

  getPriceForRecipePerServingSize(i: number) {
    return this.recipes[i].servingSize ? (this.getPriceForRecipe(i) * this.recipes[i].servingSize) : this.getPriceForRecipe(i);
  }
}
