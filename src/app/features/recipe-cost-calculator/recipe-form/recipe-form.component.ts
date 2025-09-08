import { Component, inject, output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Recipe } from '../data';

@Component({
  selector: 'app-recipe-form',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent {
  submitEvent = output<Recipe>();
  private readonly fb: FormBuilder = inject(FormBuilder);

  private readonly ingredientForm = {
    name: this.fb.control(null),
    price: this.fb.control(null, {nonNullable: true}),
    quantity: this.fb.control(null, {nonNullable: true}),
    quantityUsed: this.fb.control(null, {nonNullable: true})
  }

  form: FormGroup = this.fb.group({
    name: this.fb.control(null, {nonNullable: true}),
    ingredients: this.fb.array([this.fb.group(this.ingredientForm)]),
    servingSize: this.fb.control(null)
  });

  get ingredients() {
    return this.form.get('ingredients') as FormArray;
  }

  getIngredientFormGroup(i: number) {
    return this.ingredients.at(i) as FormGroup;
  }

  onSubmit(): void {
    this.submitEvent.emit(this.form.value as Recipe);
    this.form.reset();
  }

  addIngredient() {
    (this.form.get('ingredients') as FormArray).push(this.fb.group(this.ingredientForm));
  }
}
